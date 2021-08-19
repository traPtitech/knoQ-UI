<template>
  <v-form ref="form" v-model="valid">
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

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, PropSync, Watch, Ref } from 'vue-property-decorator'
import Autocomplete from '@/components/shared/Autocomplete.vue'
import {
  formatDate,
  DATETIME_DISPLAY_FORMAT,
  today,
  getDate,
  getIso8601,
  getTime,
} from '@/workers/date'
import { strMax, strMin } from '@/workers/strCmp'
import api, { ResponseRoom } from '@/api'

export type EventInputTimeAndPlace = {
  room: ResponseRoom | null
  sharedRoom: boolean
  timeStart: string
  timeEnd: string
}

@Component({
  components: {
    Autocomplete,
  },
})
export default class EventFormTimeAndPlace extends Vue {
  @Prop({ type: Boolean, required: true })
  value!: boolean

  @PropSync('room', {
    validator: prop => typeof prop === 'object' || prop === null,
    required: true,
  })
  roomInput!: ResponseRoom | null

  @PropSync('timeStart', { type: String, required: true })
  timeStartInput!: string

  @PropSync('timeEnd', { type: String, required: true })
  timeEndInput!: string

  @PropSync('sharedRoom', { type: Boolean, required: true })
  sharedRoomInput!: boolean

  dates: string[] = []
  allRooms: ResponseRoom[] = []

  async created() {
    this.allRooms = (await api.rooms.getRooms({ dateBegin: today() })).filter(
      room => room.verified
    )
  }

  @Watch('sharedRoomInput')
  @Watch('dates')
  onQueryChange() {
    this.roomInput = null
    this.timeStartInput = ''
    this.timeEndInput = ''
  }

  @Ref()
  readonly form!: { validate(): void }

  @Watch('_timeStart')
  @Watch('_timeEnd')
  @Watch('roomInput')
  private async onTimeFixed() {
    if (!this._timeStart || !this._timeEnd) {
      return
    }
    await this.$nextTick()
    this.form.validate()
  }

  get _timeStart(): string {
    return this.timeStartInput && getTime(this.timeStartInput)
  }
  set _timeStart(time: string) {
    if (this.roomInput) {
      this.timeStartInput = getIso8601(getDate(this.roomInput.timeStart), time)
    }
  }
  get _timeEnd(): string {
    return this.timeEndInput && getTime(this.timeEndInput)
  }
  set _timeEnd(time: string) {
    if (this.roomInput) {
      this.timeEndInput = getIso8601(getDate(this.roomInput.timeEnd), time)
    }
  }

  get dateMin(): string {
    return today()
  }
  get roomStartTime(): string | null {
    return this.roomInput && getTime(this.roomInput.timeStart)
  }

  get roomEndTime(): string | null {
    return this.roomInput && getTime(this.roomInput.timeEnd)
  }

  get availableRooms(): ResponseRoom[] {
    const key = this.sharedRoomInput ? 'sharedTimes' : 'freeTimes'
    return this.allRooms.flatMap(room =>
      this.dates.flatMap(date =>
        room[key]
          .filter(({ timeStart }) => timeStart.startsWith(date))
          .map(({ timeStart, timeEnd }) => ({ ...room, timeStart, timeEnd }))
      )
    )
  }

  get formatAvailableRoom() {
    const fmt = formatDate(DATETIME_DISPLAY_FORMAT)
    return (r: ResponseRoom) =>
      `${r.place}: ${fmt(r.timeStart)} ~ ${fmt(r.timeEnd)}`
  }

  get valid(): boolean {
    return this.value
  }
  set valid(value: boolean) {
    this.$emit('input', value)
  }
}
</script>
