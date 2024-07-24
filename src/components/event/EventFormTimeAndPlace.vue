<template>
  <v-form :ref="form" v-model="valid">
    <v-row>
      <v-col cols="12" md="" class="pl-4 flex-grow-0">
        <div class="text--secondary caption">
          イベントを開催する日付の候補を選んでください
        </div>
        <v-date-picker
          v-model="dates"
          show-current
          multiple
          :min="dateMin"
          class="mb-5"
        />
      </v-col>
      <v-col cols="12" md="">
        <v-checkbox v-model="sharedRoomInput" label="部屋の共用を許可する" />
        <autocomplete
          v-model="roomInput"
          filled
          label="進捗部屋"
          hint="日付の候補と部屋の共用の可否を選ぶと使える進捗部屋を選択できるようになります"
          :persistent-hint="true"
          :disabled="!dates.length"
          :items="availableRooms"
          :item-value="r => r"
          :item-text="formatAvailableRoom"
          :rules="$rules.eventRoom"
          class="mb-4"
        />
        <v-text-field
          v-model="_timeStart"
          filled
          label="開始時刻"
          :rules="$rules.eventTimeStart(_timeEnd, roomStartTime, roomEndTime)"
          :disabled="!roomInput"
          type="time"
        />
        <v-text-field
          v-model="_timeEnd"
          filled
          label="終了時刻"
          :rules="$rules.eventTimeEnd(_timeStart, roomStartTime, roomEndTime)"
          :disabled="!roomInput"
          type="time"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import Autocomplete from '@/components/shared/Autocomplete.vue'
import {
  formatDate,
  DATETIME_DISPLAY_FORMAT,
  today,
  getDate,
  getIso8601,
  getTime,
} from '@/workers/date'
import api, { ResponseRoom } from '@/api'

export type EventInputTimeAndPlace = {
  room: ResponseRoom | null
  sharedRoom: boolean
  timeStart: string
  timeEnd: string
}

const props = defineProps<{
  value: boolean
  eventInputTimeAndPlace: EventInputTimeAndPlace
}>()

const emit = defineEmits<{
  (e: 'update:value', newValue: boolean): void
  (e: 'update:eventInputTimeAndPlace', newValue: EventInputTimeAndPlace): void
}>()

const sharedRoomInput = computed({
  get: () => props.eventInputTimeAndPlace.sharedRoom,
  set: v =>
    emit('update:eventInputTimeAndPlace', {
      ...props.eventInputTimeAndPlace,
      sharedRoom: v,
    }),
})
const roomInput = computed({
  get: () => props.eventInputTimeAndPlace.room,
  set: v =>
    emit('update:eventInputTimeAndPlace', {
      ...props.eventInputTimeAndPlace,
      room: v,
    }),
})
const timeStartInput = computed({
  get: () => props.eventInputTimeAndPlace.timeStart,
  set: v =>
    emit('update:eventInputTimeAndPlace', {
      ...props.eventInputTimeAndPlace,
      timeStart: v,
    }),
})
const timeEndInput = computed({
  get: () => props.eventInputTimeAndPlace.timeEnd,
  set: v =>
    emit('update:eventInputTimeAndPlace', {
      ...props.eventInputTimeAndPlace,
      timeEnd: v,
    }),
})
const dates = ref<string[]>([])
const allRooms = ref<ResponseRoom[]>([])

;(async () => {
  allRooms.value = (await api.rooms.getRooms({ dateBegin: today() })).filter(
    room => room.verified
  )
})()

const form = ref<{ validate(): void }>()

const _timeStart = computed({
  get: () => timeStartInput.value && getTime(timeStartInput.value),
  set: time => {
    if (roomInput.value) {
      timeStartInput.value = getIso8601(
        getDate(roomInput.value.timeStart),
        time
      )
    }
  },
})

const _timeEnd = computed({
  get: () => timeEndInput.value && getTime(timeEndInput.value),
  set: time => {
    if (roomInput.value) {
      timeEndInput.value = getIso8601(getDate(roomInput.value.timeEnd), time)
    }
  },
})

watch([sharedRoomInput, dates], () => {
  roomInput.value = null
  timeStartInput.value = ''
  timeEndInput.value = ''
})

watch([_timeStart, _timeEnd, roomInput], async () => {
  if (!_timeStart.value || _timeEnd.value) return
  await nextTick()
  if (!form.value) return
  form.value.validate()
})

const dateMin = today()
const roomStartTime = computed(
  () => roomInput.value && getTime(roomInput.value.timeStart)
)
const roomEndTime = computed(() => roomInput.value && roomInput.value.timeEnd)

const availableRooms = computed((): ResponseRoom[] => {
  const key = sharedRoomInput.value ? 'sharedTimes' : 'freeTimes'
  return allRooms.value.flatMap(room =>
    dates.value.flatMap(date =>
      room[key]
        .filter(({ timeStart }) => timeStart.startsWith(date))
        .map(({ timeStart, timeEnd }) => ({ ...room, timeStart, timeEnd }))
    )
  )
})

const formatAvailableRoom = () => {
  const fmt = formatDate(DATETIME_DISPLAY_FORMAT)
  return (r: ResponseRoom) =>
    `${r.place}: ${fmt(r.timeStart)} ~ ${fmt(r.timeEnd)}`
}

const valid = computed({
  get: () => props.value,
  set: v => emit('update:value', v),
})
</script>
