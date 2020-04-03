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
        <v-checkbox v-model="sharedRoomSync" label="部屋の共用を許可する" />
        <v-autocomplete
          v-model="roomSync"
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
import { Component, Prop, PropSync, Watch } from 'vue-property-decorator'
import TimePicker from '@/components/shared/TimePicker.vue'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import { calcAvailableRooms, AvailableRoom } from '@/workers/availableRooms'
import { today, getDate, getIso8601, getTime } from '@/workers/date'
import { strMax, strMin } from '@/workers/strCmp'

const RoomsRepo = RepositoryFactory.get('rooms')
const EventsRepo = RepositoryFactory.get('events')

@Component({
  components: {
    TimePicker,
  },
})
export default class EventFormReservationPublic extends Vue {
  @Prop() value: boolean
  @PropSync('room') roomSync: Schemas.Room
  @PropSync('timeStart') timeStartSync: string
  @PropSync('timeEnd') timeEndSync: string
  @PropSync('sharedRoom') sharedRoomSync: boolean

  dates: string[] = []
  allRooms: Schemas.Room[] = []
  allEvents: Schemas.Event[] = []
  calcAvailableRooms: (
    dates: string[],
    sharedRoom: boolean
  ) => AvailableRoom[] | null = null

  async created() {
    await Promise.all([this.fetchRooms(), this.fetchEvents()])
    this.calcAvailableRooms = calcAvailableRooms(this.allRooms, this.allEvents)
  }
  async fetchRooms() {
    this.allRooms = (await RoomsRepo.get({ dateBegin: today() })).data
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
    this._timeStart = ''
    this._timeEnd = ''
  }

  get _timeStart(): string {
    return getTime(this.timeStartSync)
  }
  set _timeStart(time: string) {
    if (this.roomSync) {
      this.timeStartSync = getIso8601(getDate(this.roomSync.timeStart), time)
    }
  }
  get _timeEnd(): string {
    return getTime(this.timeEndSync)
  }
  set _timeEnd(time: string) {
    if (this.roomSync) {
      this.timeEndSync = getIso8601(getDate(this.roomSync.timeEnd), time)
    }
  }

  get dateMin(): string {
    return today()
  }
  get startMin(): string {
    return this.roomSync?.timeStart
  }
  get startMax(): string {
    return strMin(this.roomSync?.timeEnd, this._timeEnd)
  }
  get endMin(): string {
    return strMax(this.roomSync?.timeStart, this._timeStart)
  }
  get endMax(): string {
    return this.roomSync?.timeEnd
  }

  get availableRoomsList() {
    return this.calcAvailableRooms?.(this.dates, this.sharedRoomSync)
  }

  get _valid(): boolean {
    return this.value
  }
  set _valid(value: boolean) {
    this.$emit('input', value)
  }
}
</script>
