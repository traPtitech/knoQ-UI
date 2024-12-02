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
  private yearDiff = 0
  private monthDiff = 0
  private dateDiff = 0
  private hourDiff = 1

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
      this.dateEndMem = this.dateStartMem
      this.yearDiff = 0
      this.monthDiff = 0
      this.dateDiff = 0
    } else {
      const startDate = new Date(this.dateStartMem)
      const endDate = new Date(this.dateEndMem)

      endDate.setFullYear(startDate.getFullYear() + this.yearDiff)
      endDate.setMonth(startDate.getMonth() + this.monthDiff)
      endDate.setDate(startDate.getDate() + this.dateDiff)

      this.dateEndMem = endDate.toISOString().split('T')[0]
    }
  }

  public calcDateDiff() {
    if (this.dateStartMem && this.dateEndMem) {
      const startDate = new Date(this.dateStartMem)
      const endDate = new Date(this.dateEndMem)

      this.yearDiff = endDate.getFullYear() - startDate.getFullYear()
      if (this.yearDiff < 0) {
        this.yearDiff = 0
      }

      this.monthDiff =
        endDate.getMonth() -
        startDate.getMonth() +
        12 * (endDate.getFullYear() - startDate.getFullYear())
      if (this.monthDiff < 0) {
        this.monthDiff = 0
      }

      this.dateDiff = Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (this.dateDiff < 0) {
        this.dateDiff = 0
      }
    }
  }
}
</script>
