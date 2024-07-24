<template>
  <v-stepper v-model="step" non-linear>
    <v-stepper-header>
      <v-stepper-step editable :complete="validContent" step="1">
        イベント内容
      </v-stepper-step>
      <v-divider />
      <v-stepper-step editable :complete="validTimeAndPlace" step="2">
        日時・場所
      </v-stepper-step>
      <v-divider />
      <v-stepper-step editable :complete="valid" step="3">
        確認
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items class="pb-1">
      <v-stepper-content step="1">
        <event-form-content
          :content="content"
          @update:content="v => (content = v)"
          :isValid="validContent"
          @update:isValid="updateValidContent"
        />
        <form-next-button :disabled="!validContent" @click="step = 2">
          Continue
        </form-next-button>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-tabs v-model="tab">
          <v-tab>進捗部屋で開催</v-tab>
          <v-tab>その他で開催</v-tab>
          <v-tab-item class="pt-3">
            <event-form-time-and-place
              :value="validTimeAndPlaceDefault"
              @update:value="v => (validTimeAndPlaceDefault = v)"
              :eventInputTimeAndPlace="timeAndPlace"
              @update:eventInputTimeAndPlace="v => (timeAndPlace = v)"
            />
          </v-tab-item>
          <v-tab-item class="pt-3">
            <event-form-time-and-place-instant
              :value="validTimeAndPlacePersonal"
              @update:value="v => (validTimeAndPlacePersonal = v)"
              :eventInputTimeAndPlaceInstant="timeAndPlaceInstant"
              @update:eventInputTimeAndPlaceInstant="
                v => (timeAndPlaceInstant = v)
              "
            />
          </v-tab-item>
        </v-tabs>
        <form-back-button class="mr-2" @click="step = 1">Back</form-back-button>
        <form-next-button :disabled="!validTimeAndPlace" @click="step = 3">
          Continue
        </form-next-button>
      </v-stepper-content>

      <v-stepper-content step="3">
        <event-form-summary
          v-if="summary"
          :eventSummary="summary"
          :content="content"
          :isEdit="isEdit"
        />
        <form-back-button class="mr-2" @click="step = 2">
          Back
        </form-back-button>
        <form-next-button :disabled="!valid" @click="submit">
          Submit
        </form-next-button>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import EventFormContent, {
  EventInputContent,
} from '@/components/event/EventFormContent.vue'
import EventFormTimeAndPlace, {
  EventInputTimeAndPlace,
} from '@/components/event/EventFormTimeAndPlace.vue'
import EventFormTimeAndPlaceInstant, {
  EventInputTimeAndPlaceInstant,
} from '@/components/event/EventFormTimeAndPlaceInstant.vue'
import EventFormSummary, {
  EventSummary,
} from '@/components/event/EventFormSummary.vue'
import FormNextButton from '@/components/shared/FormNextButton.vue'
import FormBackButton from '@/components/shared/FormBackButton.vue'
import { useDraftConfirmer } from '@/workers/draftConfirmer'
import { removeDraftConfirmer } from '@/workers/draftConfirmer'
import router from '@/router'
import { useStore } from '@/workers/store'
import { useRoute } from 'vue-router/composables'

export type EventInput = EventInputContent &
  (
    | ({ instant: false } & Partial<EventInputTimeAndPlace>)
    | ({ instant: true } & Partial<EventInputTimeAndPlaceInstant>)
  )

export type EventOutput = EventInputContent &
  (
    | ({ instant: false } & EventInputTimeAndPlace)
    | ({ instant: true } & EventInputTimeAndPlaceInstant)
  )

enum TimeAndPlaceFormTab {
  Default = 0,
  Personal = 1,
}

const store = useStore()
const route = useRoute()

const props = defineProps<{
  isEdit: boolean
  event?: EventInput | undefined
}>()

const emits = defineEmits<{
  (e: 'submit', output: EventOutput): void
}>()

const content = ref<EventInputContent>({
  name: props.event?.name ?? '',
  description: props.event?.description ?? '',
  group: props.event?.group ?? null,
  open: props.event?.open ?? false,
  tags: props.event?.tags ?? [],
  admins:
    props.event?.admins ??
    (store.direct.state.me ? [store.direct.state.me] : []),
})

const timeAndPlace = ref<EventInputTimeAndPlace>({
  timeStart:
    props.event && !props.event.instant ? props.event.timeStart ?? '' : '',
  timeEnd: props.event && !props.event.instant ? props.event.timeEnd ?? '' : '',
  room: props.event && !props.event.instant ? props.event.room ?? null : null,
  sharedRoom:
    props.event && !props.event.instant ? props.event.sharedRoom ?? true : true,
})
const timeAndPlaceInstant = ref<EventInputTimeAndPlaceInstant>({
  timeStart: props.event?.instant ? props.event.timeStart ?? '' : '',
  timeEnd: props.event?.instant ? props.event.timeEnd ?? '' : '',
  place: props.event?.instant ? props.event.place ?? '' : '',
})
const instant = ref<boolean>(props.event?.instant ?? false)
const originalSummary = ref<EventSummary | null>(null)
const step = ref(1)

const beforeEachControl = ref<(() => void) | null>(null)

const tab = computed({
  get: () =>
    instant.value ? TimeAndPlaceFormTab.Personal : TimeAndPlaceFormTab.Default,

  set: (t: number) => {
    switch (t) {
      case TimeAndPlaceFormTab.Default:
        instant.value = false
        break
      case TimeAndPlaceFormTab.Personal:
        instant.value = true
        break
    }
  },
})

const valid = computed(() => validContent.value && validTimeAndPlace.value)
const validContent = ref(false)
const updateValidContent = (newValue: boolean) =>
  (validContent.value = newValue)
const validTimeAndPlaceDefault = ref(false)
const validTimeAndPlacePersonal = ref(false)
const validTimeAndPlace = computed(
  () =>
    (!instant.value && validTimeAndPlaceDefault.value) ||
    (instant.value && validTimeAndPlacePersonal.value)
)
const summary = computed<EventSummary | null>(() => {
  if (
    !content.value ||
    instant.value === null ||
    !timeAndPlace.value ||
    !timeAndPlaceInstant.value
  )
    return null
  return {
    name: content.value.name,
    description: content.value.description,
    tags: content.value.tags,
    groupName: content.value.group?.name ?? '',
    open: content.value.open,
    place: instant.value
      ? timeAndPlaceInstant.value?.place
      : timeAndPlace.value.room?.place ?? '',
    isPrivate: instant.value,
    sharedRoom: instant.value ? false : timeAndPlace.value.sharedRoom,
    timeStart: instant.value
      ? timeAndPlaceInstant.value.timeStart
      : timeAndPlace.value.timeStart,
    timeEnd: instant.value
      ? timeAndPlaceInstant.value.timeEnd
      : timeAndPlace.value.timeEnd,
  }
})

const isChanged = computed(() => {
  if (summary.value && originalSummary.value) {
    return (
      JSON.stringify(summary.value) !== JSON.stringify(originalSummary.value)
    )
  }
  return false
})

const cleanupContent = () => {
  if (!summary.value) return
  summary.value.name = ''
  summary.value.description = ''
  summary.value.tags = []
  summary.value.groupName = ''
  summary.value.place = ''
  summary.value.timeStart = ''
  summary.value.timeEnd = ''
  summary.value.open = false
  summary.value.sharedRoom = true
}

const isEventNewOrEdit = () => route.name === 'EventNew'

const beforLeaveGuardinEventEdit = (to, from, next) => {
  if (from.name !== 'EventEdit') {
    return next()
  }

  if (!isChanged.value) {
    return next()
  }

  if (
    confirm(
      '入力されたデータは送信されないまま破棄されますが，よろしいですか。'
    )
  ) {
    removeDraftConfirmer()
    cleanupContent()
    return next()
  }

  return next(false)
}

const beforLeaveGuardinEventNew = (to, from, next) => {
  if (from.name !== 'EventNew' || !isChanged.value) {
    return next()
  }

  if (
    confirm(
      '入力されたデータは送信されないまま破棄されますが，よろしいですか。'
    )
  ) {
    removeDraftConfirmer()
    cleanupContent()
    return next()
  }

  return next(false)
}

watch(summary, () => {
  if (isChanged.value) {
    useDraftConfirmer()
  } else {
    removeDraftConfirmer()
  }
})
onMounted(() => {
  if (isEventNewOrEdit()) {
    beforeEachControl.value = router.beforeEach(beforLeaveGuardinEventNew)
  } else {
    beforeEachControl.value = router.beforeEach(beforLeaveGuardinEventEdit)
  }
  originalSummary.value = JSON.parse(JSON.stringify(summary.value))
})

onBeforeUnmount(() => {
  if (beforeEachControl.value) {
    beforeEachControl.value()
  }
})

const submit = () => {
  removeDraftConfirmer()
  cleanupContent()
  if (beforeEachControl.value) {
    beforeEachControl.value()
  }
  emits('submit', {
    ...content.value,
    group: content.value.group,
    ...(instant.value
      ? { instant: true, ...timeAndPlaceInstant.value }
      : { instant: false, ...timeAndPlace.value }),
  })
}
</script>
