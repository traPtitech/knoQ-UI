<template>
  <v-container>
    <ProgressCircular v-if="status === 'loading'" />
    <LoadFailedText v-else-if="status === 'error'" />
    <v-card v-else-if="event" class="pa-9">
      <div class="mb-12">
        <v-row no-gutters>
          <v-col>
            <h1 class="mb-1 display-1">{{ event.name }}</h1>
          </v-col>
          <v-col class="flex-grow-0">
            <ActionMenu>
              <v-list-item
                v-if="isMyEvent"
                :to="`/events/edit/${event.eventId}`"
              >
                <v-list-item-title>Edit this event</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="isMyEvent"
                :to="`/events/new?baseID=${event.eventId}`"
              >
                <v-list-item-title>
                  Create new one based on this
                </v-list-item-title>
              </v-list-item>
            </ActionMenu>
          </v-col>
        </v-row>
        <div class="mb-3">
          <template v-if="!isTagEditting">
            <span v-if="!event.tags.length" class="text--secondary">
              No tags
            </span>
            <EventTag
              v-for="tag in event.tags"
              :key="tag.name"
              to-tag-page-on-click
              :name="tag.name"
              class="mr-3"
            />
            <v-btn
              x-small
              outlined
              color="primary"
              @click="isTagEditting = true"
            >
              Edit tags
            </v-btn>
          </template>
          <EventTagEditor
            v-else
            v-model="editedTags"
            :tags="tagNames"
            @tagEditStart="onTagEditStart"
            @tagEditEnd="onTagEditEnd"
          />
        </div>
        <div class="text--secondary">
          <span v-if="event.group" class="mr-3">
            by
            <router-link :to="`/groups/${event.group.groupId}`">
              {{ event.group.name }}
            </router-link>
          </span>
          <div v-else>
            <v-icon small color="error" class="mb-1">mdi-alert-circle</v-icon>
            グループ不明
          </div>
        </div>
      </div>
      <div class="mb-5">
        <div class="text--secondary mb-n1">Date</div>
        <div class="headline">
          {{ formatDate(event.timeStart) }}
          <v-icon>mdi-chevron-right</v-icon>
          {{ formatDate(event.timeEnd) }}
        </div>
      </div>
      <div class="mb-5">
        <div class="text--secondary mb-n1">Place</div>
        <div class="headline">
          <a
            v-if="isTitechRoom(event.room.place)"
            :href="calcRoomPdfUrl(event.room.place)"
            target="_blank"
            rel="noreferer noopener"
            class="mr-3"
          >
            {{ event.room.place }}
          </a>
          <span v-else class="mr-3">
            <event-place :place="event.room.place"></event-place>
          </span>
        </div>
        <div v-if="event.room.verified" class="text--secondary body-2">
          <v-icon :color="sharedRoomIcon.color">
            {{ sharedRoomIcon.icon }}
          </v-icon>
          {{ sharedRoomString }}
        </div>
      </div>
      <div class="mb-10">
        <MarkdownField class="mt-10" :src="event.description" />
      </div>
      <attendance-form
        v-if="canAttendEvent && !isFinishedEvent"
        class="mb-5 pl-5 pr-5 pb-5"
        :attendance="attendance"
        @change="onAttendanceChange"
      />
      <div>
        <div class="text--secondary mb-1">参加予定</div>
        <event-attendees :event="event" :attendees-per-page="6" />
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ProgressCircular from '@/components/shared/ProgressCircular.vue'
import LoadFailedText from '@/components/shared/LoadFailedText.vue'
import EventTag from '@/components/shared/EventTag.vue'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import EventTagEditor from '@/components/event/EventTagEditor.vue'
import ActionMenu from '@/components/shared/ActionMenu.vue'
import AttendanceForm from '@/components/event/AttendanceForm.vue'
import EventAttendees from '@/components/event/EventAttendees.vue'
import {
  formatDate as _formatDate,
  DATETIME_DISPLAY_FORMAT,
} from '@/workers/date'
import { isTitechRoom, calcRoomPdfUrl } from '@/workers/TokyoTech'
import EventPlace from '@/components/event/EventPlace.vue'

import api, { ResponseEventDetail, RequestScheduleScheduleEnum } from '@/api'
import { useStore } from '@/workers/store'
import { useRoute } from 'vue-router/composables'

const route = useRoute()
const store = useStore()
const me = store.direct.state.me!

const status = ref<'loading' | 'loaded' | 'error'>('loading')
const isTagEditting = ref(false)

const event = ref<ResponseEventDetail | null>(null)
const attendance = ref<RequestScheduleScheduleEnum | null>(null)
const editedTags = ref<string[]>([])

;(async () => {
  const eventID = route.params.id
  status.value = 'loading'
  try {
    event.value = await api.events.getEventDetail({ eventID })
    attendance.value =
      (event.value.attendees.find(({ userId }) => userId === me.userId)
        ?.schedule as RequestScheduleScheduleEnum | undefined) ?? null
  } catch (__) {
    status.value = 'error'
    return
  }
  status.value = 'loaded'
})()

const formatDate = _formatDate(DATETIME_DISPLAY_FORMAT)

const sharedRoomString = computed(() =>
  event.value?.sharedRoom ? '部屋の共用可能' : '部屋の共用不可能'
)
const sharedRoomIcon = computed(() =>
  event.value?.sharedRoom
    ? { icon: 'mdi-door-open', color: 'success' }
    : { icon: 'mdi-door-closed-lock', color: 'error' }
)

const tagNames = computed(() => event.value?.tags.map(({ name }) => name) ?? [])

const onTagEditStart = () => {
  editedTags.value = event.value?.tags.map(({ name }) => name) ?? []
}

const onTagEditEnd = async () => {
  const prevTagNames = event.value?.tags.map(({ name }) => name) ?? []
  const added = difference(editedTags.value, prevTagNames)
  const deleted = difference(prevTagNames, editedTags.value)
  const eventID = route.params.id
  await Promise.all([
    ...added.map(name =>
      api.events.addEventTag({ eventID, requestTag: { name } })
    ),
    ...deleted.map(name =>
      api.events.deleteEventTag({ eventID, tagName: name })
    ),
  ])
  event.value = await api.events.getEventDetail({ eventID })
  isTagEditting.value = false
  editedTags.value = []
}

const isOpenEvent = computed(() => event.value?.open ?? false)

const canAttendEvent = computed(() => {
  if (!event.value) {
    return false
  }
  const isOpen = isOpenEvent.value
  const isEventOfJoiningGroup = event.value.attendees.some(
    ({ userId }) => userId === me.userId
  )
  return isOpen || isEventOfJoiningGroup
})

const isFinishedEvent = computed(() => {
  if (!event.value) {
    return true
  }
  return new Date(event.value.timeEnd) < new Date()
})

const isMyEvent = computed(
  () =>
    event.value?.admins.includes(store.direct.state.me?.userId ?? '') ?? false
)

const onAttendanceChange = async (
  newAttendance: RequestScheduleScheduleEnum
) => {
  console.log('fwaohewfjioewfjfihooisu')
  const oldAttendance = attendance.value
  attendance.value = newAttendance
  try {
    if (!event.value) {
      return
    }
    await api.events.updateSchedule({
      eventID: event.value.eventId,
      requestSchedule: {
        schedule: newAttendance,
      },
    })
    event.value = await api.events.getEventDetail({
      eventID: event.value.eventId,
    })
  } catch (err) {
    console.error(err)
    alert('参加予定を登録できませんでした')
    attendance.value = oldAttendance
  }
}

function difference<T>(xs: T[], ys: T[]): T[] {
  return xs.filter(x => !ys.includes(x))
}
</script>
