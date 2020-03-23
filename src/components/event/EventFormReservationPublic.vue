<template>
  <v-form v-model="_valid">
    <v-row>
      <v-col class="pl-4 flex-grow-0">
        <div class="text--secondary caption">
          イベントを開催する日付の候補を選んでください
        </div>
        <v-date-picker v-model="dateList" show-current multiple class="mb-5" />
      </v-col>
      <v-col>
        <v-checkbox v-model="_sharedRoom" label="部屋の共用を許可する" />
        <v-autocomplete
          v-model="_room"
          outlined
          label="進捗部屋"
          :items="availableRoomsList"
          :item-value="r => r"
          :item-text="
            r => `${r.place}: ${r.date} ${r.timeStart} ~ ${r.timeEnd}`
          "
          :rules="$rules.eventRoom"
        />
        <TimePicker
          v-model="_timeStart"
          label="開始時刻"
          :rules="$rules.eventTimeStart"
          :disabled="!room"
          :min="room && room.timeStart"
          :max="room && room.timeEnd"
        />
        <TimePicker
          v-model="_timeEnd"
          label="終了時刻"
          :rules="$rules.eventTimeEnd"
          :disabled="!_timeStart"
          :min="_timeStart"
          :max="room && room.timeEnd"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, PropSync, Watch } from 'vue-property-decorator'
import TimePicker from '@/components/shared/TimePicker.vue'

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

  @Watch('_sharedRoom')
  @Watch('dateList')
  onQueryChange() {
    this._room = null
    this._timeStart = ''
    this._timeEnd = ''
  }

  dateList: string[] = []
  roomsList = Array.from({ length: 9 }, (_, i) => ({
    roomId: i,
    place: 'S512',
    date: `2020-03-0${i + 1}`,
    timeStart: '17:00',
    timeEnd: '20:00',
  }))

  get availableRoomsList() {
    return this.roomsList.filter(v => this.dateList.includes(v.date))
  }

  get _valid(): boolean {
    return this.value
  }
  set _valid(value: boolean) {
    this.$emit('input', value)
  }
}
</script>
