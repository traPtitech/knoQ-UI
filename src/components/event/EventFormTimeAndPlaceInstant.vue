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
      @blur="autoFillDateEnd"
    />
    <v-text-field
      v-model="timeStartMem"
      filled
      label="開始時刻"
      :rules="$rules.eventTimeInstant(timeStartInput, timeEndInput)"
      type="time"
      @blur="autoFillTimeEnd"
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
      @blur="calcDateDiff"
    />
    <v-text-field
      v-model="timeEndMem"
      filled
      label="終了時刻"
      :rules="$rules.eventTimeInstant(timeStartInput, timeEndInput)"
      type="time"
      @blur="calcTimeDiff"
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
  private hourDiff = 1
  private minuteDiff = 0

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

  public autoFillDateEnd() {
    if (!this.dateEndMem) {
      this.dateDiff = 0
      this.dateEndMem = this.dateStartMem
    } else {
      let startDate = new Date(this.dateStartMem)
      let endDate = startDate
      endDate.setDate(startDate.getDate() + this.dateDiff)
      this.dateEndMem = endDate.toISOString().split('T')[0]
    }
  }

  public autoFillTimeEnd() {
    if (!this.timeEndMem) {
      this.hourDiff = 1
      this.minuteDiff = 0
    }
    const [startHour, startMinute] = this.timeStartMem.split(':').map(Number)
    let endMinute = startMinute + this.minuteDiff
    let endHour = startHour + this.hourDiff

    if (endMinute >= 60) {
      endHour += 1
      endMinute -= 60
    }
    if (endHour >= 24) {
      endHour -= 24
    }
    this.timeEndMem = `${String(endHour).padStart(2, '0')}:${String(
      endMinute
    ).padStart(2, '0')}`
  }

  public calcDateDiff() {
    if (this.dateStartMem && this.dateEndMem) {
      const startDate = new Date(this.dateStartMem)
      const endDate = new Date(this.dateEndMem)
      this.dateDiff = Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (this.dateDiff < 0) {
        this.dateDiff = 0
      }
    }
  }

  public calcTimeDiff() {
    if (this.timeStartMem && this.timeEndMem) {
      const startDateTime = new Date(
        `${this.dateStartMem}T${this.timeStartMem}`
      )
      const endDateTime = new Date(`${this.dateEndMem}T${this.timeEndMem}`)
      const diffInMilliseconds = endDateTime.getTime() - startDateTime.getTime()
      if (diffInMilliseconds > 0) {
        this.hourDiff = Math.floor(diffInMilliseconds / (1000 * 60 * 60)) % 24
        this.minuteDiff = Math.floor(diffInMilliseconds / (1000 * 60)) % 60
      } else {
        this.hourDiff = 0
        this.minuteDiff = 0
      }
    }
    console.log(this.hourDiff, this.minuteDiff)
  }
}
</script>
