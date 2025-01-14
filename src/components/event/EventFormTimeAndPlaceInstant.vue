<template>
  <v-form ref="form" v-model="valid">
    <v-text-field
      v-model="placeInput"
      filled
      label="場所"
      :rules="$rules.eventPlace"
    />
    <v-text-field
      v-model="dateStartMem"
      filled
      label="開催日"
      :rules="
        $rules.eventDate &&
        $rules.eventTimeInstant(timeStartInput, timeEndInput)
      "
      type="date"
      @blur="updateEndDateTime"
    />
    <v-text-field
      v-model="timeStartMem"
      filled
      label="開始時刻"
      :rules="$rules.eventTimeInstant(timeStartInput, timeEndInput)"
      type="time"
      @blur="updateEndDateTime"
    />
    <v-text-field
      v-model="dateEndMem"
      filled
      label="終了日"
      :rules="
        $rules.eventDate &&
        $rules.eventTimeInstant(timeStartInput, timeEndInput)
      "
      type="date"
      @blur="recalculateTimeDiff"
    />
    <v-text-field
      v-model="timeEndMem"
      filled
      label="終了時刻"
      :rules="$rules.eventTimeInstant(timeStartInput, timeEndInput)"
      type="time"
      @blur="recalculateTimeDiff"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, PropSync, Watch, Ref } from 'vue-property-decorator'
import { getDate, getTime, getIso8601, today } from '@/workers/date'

export type EventInputTimeAndPlaceInstant = {
  place: string
  timeStart: string
  timeEnd: string
}

@Component({})
export default class EventFormTimeAndPlaceInstant extends Vue {
  @PropSync('place', { type: String, required: true })
  placeInput!: string

  @PropSync('timeStart', { type: String, required: true })
  timeStartInput!: string

  @PropSync('timeEnd', { type: String, required: true })
  timeEndInput!: string

  @Prop({ type: Boolean, required: true })
  value!: boolean

  private dateStartMem = ''
  private dateEndMem = ''
  private timeStartMem = ''
  private timeEndMem = ''
  private dateDiff = 0
  private minuteDiff = 60

  @Ref()
  readonly form!: { validate(): void }

  created() {
    this.dateStartMem = this.timeStartInput && getDate(this.timeStartInput)
    this.dateEndMem = this.timeEndInput && getDate(this.timeEndInput)
    this.timeStartMem = this.timeStartInput && getTime(this.timeStartInput)
    this.timeEndMem = this.timeEndInput && getTime(this.timeEndInput)
  }

  get dateMin(): string {
    return today()
  }

  get valid(): boolean {
    return this.value
  }
  set valid(value: boolean) {
    this.$emit('input', value)
  }

  @Watch('timeStartInput')
  @Watch('timeEndInput')
  private async onDateTimeFixed() {
    if (!this.timeStartInput || !this.timeEndInput) {
      return
    }
    await this.$nextTick()
    this.form.validate()
  }

  @Watch('dateStartMem')
  @Watch('timeStartMem')
  private onTimeStartMemChange() {
    if (this.dateStartMem && this.timeStartMem) {
      this.timeStartInput = getIso8601(this.dateStartMem, this.timeStartMem)
    }
  }

  @Watch('dateEndMem')
  @Watch('timeEndMem')
  private onTimeEndMemChange() {
    if (this.dateEndMem && this.timeEndMem) {
      this.timeEndInput = getIso8601(this.dateEndMem, this.timeEndMem)
    }
  }

  public updateEndDateTime() {
    if (!this.minuteDiff) {
      this.minuteDiff = 60
    }

    const startDateTime = new Date(`${this.dateStartMem}T${this.timeStartMem}`)
    startDateTime.setMinutes(startDateTime.getMinutes() + this.minuteDiff)

    const localDateTime = new Date(
      startDateTime.getTime() - startDateTime.getTimezoneOffset() * 60000
    ).toISOString()
    this.dateEndMem = localDateTime.split('T')[0]

    const hours = String(startDateTime.getHours()).padStart(2, '0')
    const minutes = String(startDateTime.getMinutes()).padStart(2, '0')
    this.timeEndMem = `${hours}:${minutes}`
  }

  public recalculateTimeDiff() {
    if (this.timeStartMem && this.timeEndMem) {
      const startDateTime = new Date(
        `${this.dateStartMem}T${this.timeStartMem}`
      )
      const endDateTime = new Date(`${this.dateEndMem}T${this.timeEndMem}`)
      const diffInMilliseconds = endDateTime.getTime() - startDateTime.getTime()
      if (diffInMilliseconds > 0) {
        this.minuteDiff = Math.floor(diffInMilliseconds / (1000 * 60))
      } else {
        this.minuteDiff = 0
      }
    }
  }
}
</script>
