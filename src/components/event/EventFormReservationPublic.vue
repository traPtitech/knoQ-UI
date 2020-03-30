<template>
  <v-form v-model="_valid">
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
        <v-checkbox v-model="_sharedRoom" label="部屋の共用を許可する" />
        <v-autocomplete
          v-model="_room"
          outlined
          label="進捗部屋"
          :disabled="!dates.length"
          :items="availableRoomsList"
          :item-value="r => r"
          :item-text="r => `${r.place}: ${r.timeStart} ~ ${r.timeEnd}`"
          :rules="$rules.eventRoom"
        />
        <TimePicker
          v-model="_timeStart"
          label="開始時刻"
          :rules="$rules.eventTimeStart"
          :disabled="!_room"
          :min="startMin"
          :max="startMax"
        />
        <TimePicker
          v-model="_timeEnd"
          label="終了時刻"
          :rules="$rules.eventTimeEnd"
          :disabled="!_room"
          :min="endMin"
          :max="endMax"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, PropSync, Watch } from 'vue-property-decorator'
import TimePicker from '@/components/shared/TimePicker.vue'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
import { calcAvailableRooms, AvailableRoom } from '@/utils/availableRooms'
import { todayStr } from '@/utils/date'

const RoomsRepo = RepositoryFactory.get('rooms')
const EventsRepo = RepositoryFactory.get('events')

@Component({
  components: {
    TimePicker,
  },
})
export default class EventFormReservationPublic extends Vue {
  @Prop() value: boolean
  @PropSync('room') _room: any
  @PropSync('timeStart') _timeStart: string
  @PropSync('timeEnd') _timeEnd: string
  @PropSync('sharedRoom') _sharedRoom: boolean

  dates: string[] = []
  allRooms: Schemas.Room[] = []
  allEvents: Schemas.Event[] = []
  calcAvailableRooms: (dates: string[], sharedRoom: boolean) => AvailableRoom[]

  created() {
    Promise.all([this.fetchRooms(), this.fetchEvents()])
    this.calcAvailableRooms = calcAvailableRooms(this.allRooms, this.allEvents)
  }
  async fetchRooms() {
    this.allRooms = (await RoomsRepo.get()).data
  }
  async fetchEvents() {
    this.allEvents = (await EventsRepo.get({ dateBegin: todayStr })).data
  }

  @Watch('_sharedRoom')
  @Watch('dates')
  onQueryChange() {
    this._room = null
    this._timeStart = ''
    this._timeEnd = ''
  }

  get dateMin(): string {
    return todayStr
  }
  get startMin(): string {
    // return this._room?.timeStart
    return this._room && this._room.timeStart
  }
  get startMax(): string {
    // if (this._room?.timeEnd < time._timeEnd) {
    if (this._room && this._room.timeEnd < this._timeEnd) {
      return this._room.timeEnd
    }
    return this._timeEnd
  }
  get endMin(): string {
    // if (this._room?.timeStart < time._timeStart) {
    if (this._room && this._room.timeStart > this._timeStart) {
      return this._room.timeStart
    }
    return this._timeStart
  }
  get endMax(): string {
    // this._room?.timeEnd
    return this._room && this._room.timeEnd
  }

  get availableRoomsList() {
    return (
      // this.calcAvailableRooms?.(this.dates, this._sharedRoom)
      this.calcAvailableRooms &&
      this.calcAvailableRooms(this.dates, this._sharedRoom)
    )
  }

  get _valid(): boolean {
    return this.value
  }
  set _valid(value: boolean) {
    this.$emit('input', value)
  }
}
</script>
