<template>
  <v-form v-model="_valid">
    <v-text-field
      v-model="_place"
      outlined
      label="場所"
      placeholder="チズケ2階"
      :rules="$rules.eventPlace"
    />
    <v-dialog width="290px">
      <template #activator="{ on }">
        <v-text-field
          v-model="_date"
          outlined
          label="開催日"
          readonly
          :rules="$rules.eventDate"
          v-on="on"
        />
      </template>
      <v-date-picker v-model="_date" show-current />
    </v-dialog>
    <TimePicker
      v-model="_timeStart"
      label="開始時刻"
      :rules="$rules.eventTimeStart"
      :max="_timeEnd"
    />
    <TimePicker
      v-model="_timeEnd"
      label="終了時刻"
      :rules="$rules.eventTimeEnd"
      :min="_timeStart"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, PropSync } from 'vue-property-decorator'
import TimePicker from '@/components/shared/TimePicker.vue'

@Component({
  components: {
    TimePicker,
  },
})
export default class EventFormReservationPrivate extends Vue {
  @PropSync('place') _place: string
  @PropSync('date') _date: string
  @PropSync('timeStart') _timeStart: string
  @PropSync('timeEnd') _timeEnd: string
  @Prop() value: boolean

  get _valid(): boolean {
    return this.value
  }
  set _valid(value: boolean) {
    this.$emit('input', value)
  }
}
</script>
