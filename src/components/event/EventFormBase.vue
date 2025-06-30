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
        <event-form-content v-model="validContent" v-bind.sync="content" />
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
              v-model="validTimeAndPlaceDefault"
              v-bind.sync="timeAndPlace"
            />
          </v-tab-item>
          <v-tab-item class="pt-3">
            <event-form-time-and-place-instant
              v-model="validTimeAndPlacePersonal"
              v-bind.sync="timeAndPlaceInstant"
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
          v-bind="{ ...summary, content, isEdit: isEdit, isInstant: instant }"
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

<script lang="ts">
import EventFormContent, {
  EventInputContent,
} from '@/components/event/EventFormContent.vue'
import EventFormSummary, {
  EventSummary,
} from '@/components/event/EventFormSummary.vue'
import EventFormTimeAndPlace, {
  EventInputTimeAndPlace,
} from '@/components/event/EventFormTimeAndPlace.vue'
import EventFormTimeAndPlaceInstant, {
  EventInputTimeAndPlaceInstant,
} from '@/components/event/EventFormTimeAndPlaceInstant.vue'
import FormBackButton from '@/components/shared/FormBackButton.vue'
import FormNextButton from '@/components/shared/FormNextButton.vue'
import router from '@/router'
import {
  removeDraftConfirmer,
  useDraftConfirmer,
} from '@/workers/draftConfirmer'
import Vue from 'vue'
import { Component, Emit, Prop } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { isTrapGroup } from '@/workers/isTrapGroup'

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

@Component({
  components: {
    EventFormContent,
    EventFormTimeAndPlace,
    EventFormTimeAndPlaceInstant,
    EventFormSummary,
    FormNextButton,
    FormBackButton,
  },
})
export default class EventFormBase extends Vue {
  @Prop({ type: Boolean, required: true })
  isEdit!: boolean

  @Prop({ type: Object })
  event!: EventInput | null | undefined

  content: EventInputContent = null!

  timeAndPlace: EventInputTimeAndPlace = null!

  timeAndPlaceInstant: EventInputTimeAndPlaceInstant = null!

  instant: boolean = null!

  originalSummary: EventSummary = null!

  beforeEachControl: (() => void) | null = null

  roundToNextHour(date: Date): Date {
    const roundedDate = new Date(date)
    const minutes = roundedDate.getMinutes()
    const seconds = roundedDate.getSeconds()
    const milliseconds = roundedDate.getMilliseconds()

    if (minutes > 0 || seconds > 0 || milliseconds > 0) {
      roundedDate.setHours(roundedDate.getHours() + 1)
    }
    roundedDate.setMinutes(0, 0, 0)

    return roundedDate
  }

  created() {
    this.content = {
      name: this.event?.name ?? '',
      description: this.event?.description ?? '',
      group: this.event?.group ?? null,
      open: this.event?.open ?? false,
      tags: this.event?.tags ?? [],
      admins:
        this.event?.admins ??
        (this.$store.direct.state.me ? [this.$store.direct.state.me] : []),
    }
    this.timeAndPlace = {
      timeStart:
        this.event && !this.event.instant ? this.event.timeStart ?? '' : '',
      timeEnd:
        this.event && !this.event.instant ? this.event.timeEnd ?? '' : '',
      room: this.event && !this.event.instant ? this.event.room ?? null : null,
      sharedRoom:
        this.event && !this.event.instant
          ? this.event.sharedRoom ?? true
          : true,
    }
    this.timeAndPlaceInstant = {
      // TODO: placeだけ初期値がないとvalidationが先に走ってしまう
      timeStart: this.event?.instant
        ? this.event.timeStart ?? ''
        : this.roundToNextHour(new Date()).toISOString(),
      timeEnd: this.event?.instant
        ? this.event.timeEnd ?? ''
        : this.roundToNextHour(
            new Date(new Date().getTime() + 60 * 60 * 1000)
          ).toISOString(),
      place: this.event?.instant ? this.event.place ?? '' : '',
    }
    this.instant = this.event?.instant ?? false
  }

  step = 1

  get tab(): number {
    return this.instant
      ? TimeAndPlaceFormTab.Personal
      : TimeAndPlaceFormTab.Default
  }
  set tab(t: number) {
    switch (t) {
      case TimeAndPlaceFormTab.Default:
        this.instant = false
        break
      case TimeAndPlaceFormTab.Personal:
        this.instant = true
        break
    }
  }

  get valid(): boolean {
    return this.validContent && this.validTimeAndPlace
  }
  validContent = false
  validTimeAndPlaceDefault = false
  validTimeAndPlacePersonal = false
  get validTimeAndPlace(): boolean {
    return (
      (!this.instant && this.validTimeAndPlaceDefault) ||
      (this.instant && this.validTimeAndPlacePersonal)
    )
  }

  get isTrapGroup(): boolean {
    return this.content.group
      ? isTrapGroup(this.content.group)
      : false
  }

  get summary(): EventSummary {
    return {
      name: this.content.name,
      description: this.content.description,
      tags: this.content.tags,
      groupName: this.content.group?.name ?? '',
      open: this.content.open,
      place: this.instant
        ? this.timeAndPlaceInstant.place
        : this.timeAndPlace.room?.place ?? '',
      isPrivate: this.instant,
      sharedRoom: this.instant ? false : this.timeAndPlace.sharedRoom,
      timeStart: this.instant
        ? this.timeAndPlaceInstant.timeStart
        : this.timeAndPlace.timeStart,
      timeEnd: this.instant
        ? this.timeAndPlaceInstant.timeEnd
        : this.timeAndPlace.timeEnd,
      isTrapGroup: this.isTrapGroup,
    }
  }

  isChanged(): boolean {
    if (this.summary && this.originalSummary) {
      return (
        JSON.stringify(this.summary) !== JSON.stringify(this.originalSummary)
      )
    }
    return false
  }

  cleanupContent(): void {
    this.summary.name = ''
    this.summary.description = ''
    this.summary.tags = []
    this.summary.groupName = ''
    this.summary.place = ''
    this.summary.timeStart = ''
    this.summary.timeEnd = ''
    this.summary.open = false
    this.summary.sharedRoom = true
  }

  isEventNewOrEdit(): boolean {
    const currentRoute: Route = this.$route
    return currentRoute.name === 'EventNew'
  }

  beforLeaveGuardinEventEdit = (to, from, next) => {
    if (from.name !== 'EventEdit') {
      return next()
    }

    if (!this.isChanged()) {
      return next()
    }

    if (
      confirm(
        '入力されたデータは送信されないまま破棄されますが，よろしいですか。'
      )
    ) {
      removeDraftConfirmer()
      this.cleanupContent()
      return next()
    }

    return next(false)
  }

  beforLeaveGuardinEventNew = (to, from, next) => {
    if (from.name !== 'EventNew' || !this.isChanged()) {
      return next()
    }

    if (
      confirm(
        '入力されたデータは送信されないまま破棄されますが，よろしいですか。'
      )
    ) {
      removeDraftConfirmer()
      this.cleanupContent()
      return next()
    }

    return next(false)
  }

  mounted() {
    this.$watch(
      'summary',
      () => {
        if (this.isChanged()) {
          useDraftConfirmer()
        } else {
          removeDraftConfirmer()
        }
      },
      { deep: true }
    )
    if (this.isEventNewOrEdit()) {
      this.beforeEachControl = router.beforeEach(this.beforLeaveGuardinEventNew)
    } else {
      this.beforeEachControl = router.beforeEach(
        this.beforLeaveGuardinEventEdit
      )
    }
    this.originalSummary = JSON.parse(JSON.stringify(this.summary))
  }

  beforeDestroy() {
    if (this.beforeEachControl) {
      this.beforeEachControl()
    }
  }

  @Emit()
  submit(): EventOutput {
    removeDraftConfirmer()
    this.cleanupContent()
    if (this.beforeEachControl) {
      this.beforeEachControl()
    }
    return {
      ...this.content,
      group: this.content.group!,
      ...(this.instant
        ? { instant: true, ...this.timeAndPlaceInstant }
        : { instant: false, ...this.timeAndPlace }),
    }
  }
}
</script>
