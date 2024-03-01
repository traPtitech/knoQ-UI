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
      :rules="$rules.eventDate"
      type="date"
      @blur="setDefaultDateEnd"
    />
    <v-text-field
      v-model="timeStartMem"
      filled
      label="開始時刻"
      :rules="$rules.eventTimeStartInstant(timeEndMem)"
      type="time"
    />
    <v-text-field
      v-model="dateEndMem"
      filled
      label="終了日"
      :rules="$rules.eventDate"
      type="date"
    />
    <v-text-field
      v-model="timeEndMem"
      filled
      label="終了時刻"
      :rules="$rules.eventTimeEndInstant(timeStartMem)"
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

  @Watch('timeStartInput', { immediate: true })
  private onTimeStartPropChange() {
    this.dateStartMem = this.timeStartInput && getDate(this.timeStartInput)
    this.timeStartMem = this.timeStartInput && getTime(this.timeStartInput)
  }

  @Watch('timeEndInput', { immediate: true })
  private onTimeEndPropChange() {
    this.dateEndMem = this.timeEndInput && getDate(this.timeEndInput)
    this.timeEndMem = this.timeEndInput && getTime(this.timeEndInput)
  }

  @Ref()
  readonly form!: { validate(): void }

  @Watch('timeStartMem')
  @Watch('timeEndMem')
  private async onTimeMemFixed() {
    if (!this.timeStartMem || !this.timeEndMem) {
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

  private setDefaultDateEnd() {
    if (!this.dateEndMem) this.dateEndMem = this.dateStartMem
  }

  @Watch('dateEndMem')
  @Watch('timeEndMem')
  private onTimeEndMemChange() {
    if (this.dateEndMem && this.timeEndMem) {
      this.timeEndInput = getIso8601(this.dateEndMem, this.timeEndMem)
    }
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
}
</script>
