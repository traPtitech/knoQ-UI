<template>
  <v-form v-model="valid">
    <v-row>
      <v-col class="pl-4 flex-grow-0">
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
      <v-col>
        <v-checkbox v-model="sharedRoomSync" label="部屋の共用を許可する" />
        <v-autocomplete
          v-model="roomSync"
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
        <TimePicker
          v-model="_timeStart"
          label="開始時刻"
          :rules="$rules.eventTimeStart"
          :disabled="!roomSync"
          :min="startMin"
          :max="startMax"
        />
        <TimePicker
          v-model="_timeEnd"
          label="終了時刻"
          :rules="$rules.eventTimeEnd"
          :disabled="!roomSync"
          :min="endMin"
          :max="endMax"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import 'reflect-metadata'
import { Component, Prop, PropSync, Watch } from 'vue-property-decorator'
import TimePicker from '@/components/shared/TimePicker.vue'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import { calcAvailableRooms, AvailableRoom } from '@/workers/availableRooms'
import {
  formatDate,
  DATETIME_DISPLAY_FORMAT,
  today,
  getDate,
  getIso8601,
  getTime,
} from '@/workers/date'
import { strMax, strMin } from '@/workers/strCmp'

const RoomsRepo = RepositoryFactory.get('rooms')
const EventsRepo = RepositoryFactory.get('events')

@Component({
  components: {
    TimePicker,
  },
})
export default class EventFormReservationPublic extends Vue {
  @Prop({ required: true }) value!: boolean
  @PropSync('room', { required: true }) roomSync!: Schemas.Room | null
  @PropSync('timeStart', { required: true }) timeStartSync!: string
  @PropSync('timeEnd', { required: true }) timeEndSync!: string
  @PropSync('sharedRoom', { required: true }) sharedRoomSync!: boolean

  dates: string[] = []
  allRooms: Schemas.Room[] = []
  allEvents: Schemas.Event[] = []

  async created() {
    await Promise.all([this.fetchRooms(), this.fetchEvents()])
  }
  async fetchRooms() {
    this.allRooms = (await RoomsRepo.get({ dateBegin: today() })).data.filter(
      room => room.public
    )
  }
  async fetchEvents() {
    this.allEvents = (
      await EventsRepo.get({
        dateBegin: today(),
      })
    ).data
  }

  @Watch('sharedRoomSync')
  @Watch('dates')
  onQueryChange() {
    this.roomSync = null
    this.timeStartSync = ''
    this.timeEndSync = ''
  }

  get _timeStart(): string {
    return this.timeStartSync && getTime(this.timeStartSync)
  }
  set _timeStart(time: string) {
    if (this.roomSync) {
      this.timeStartSync = getIso8601(getDate(this.roomSync.timeStart), time)
    }
  }
  get _timeEnd(): string {
    return this.timeEndSync && getTime(this.timeEndSync)
  }
  set _timeEnd(time: string) {
    if (this.roomSync) {
      this.timeEndSync = getIso8601(getDate(this.roomSync.timeEnd), time)
    }
  }

  get dateMin(): string {
    return today()
  }
  get startMin(): string | null {
    return this.roomSync && getTime(this.roomSync.timeStart)
  }
  get startMax(): string | null {
    const timeEnd = strMin(this.roomSync?.timeEnd, this._timeEnd)
    return timeEnd && getTime(timeEnd)
  }
  get endMin(): string | null {
    const timeStart = strMax(this.roomSync?.timeStart, this._timeStart)
    return timeStart && getTime(timeStart)
  }
  get endMax(): string | null {
    return this.roomSync && getTime(this.roomSync.timeEnd)
  }

  get calcAvailableRooms() {
    return calcAvailableRooms(this.allRooms, this.allEvents)
  }

  get availableRooms() {
    return this.calcAvailableRooms(this.dates, this.sharedRoomSync)
  }

  get formatAvailableRoom() {
    const fmt = formatDate(DATETIME_DISPLAY_FORMAT)
    return (r: AvailableRoom) =>
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
