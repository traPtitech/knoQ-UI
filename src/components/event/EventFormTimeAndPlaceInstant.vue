<template>
  <v-form v-model="valid">
    <v-text-field
      v-model="placeInput"
      filled
      label="場所"
      :rules="$rules.eventPlace"
    />
    <v-dialog width="290px">
      <template #activator="{ on }">
        <v-text-field
          v-model="dateMem"
          filled
          label="開催日"
          readonly
          :rules="$rules.eventDate"
          v-on="on"
        />
      </template>
      <v-date-picker v-model="dateMem" show-current :min="dateMin" />
    </v-dialog>
    <TimePicker
      v-model="timeStartMem"
      label="開始時刻"
      :rules="$rules.eventTimeStart"
      :max="timeEndMem"
    />
    <TimePicker
      v-model="timeEndMem"
      label="終了時刻"
      :rules="$rules.eventTimeEnd"
      :min="timeStartMem"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, PropSync, Watch } from 'vue-property-decorator'
import TimePicker from '@/components/shared/TimePicker.vue'
import { getDate, getTime, getIso8601, today } from '@/workers/date'

export type EventInputTimeAndPlaceInstant = {
  place: string
  timeStart: string
  timeEnd: string
}

@Component({
  components: {
    TimePicker,
  },
})
export default class EventFormTimeAndPlaceInstant extends Vue {
  @PropSync('place', { type: String, required: true })
  placeInput!: string

  @PropSync('timeStart', { type: String, required: true })
  timeStartInput!: string

  @PropSync('timeEnd', { type: String, required: true })
  timeEndInput!: string

  @Prop({ type: Boolean, required: true })
  value!: boolean

  private dateMem = ''
  private timeStartMem = ''
  private timeEndMem = ''

  @Watch('timeStartInput', { immediate: true })
  private onTimeStartPropChange() {
    this.dateMem = this.timeStartInput && getDate(this.timeStartInput)
    this.timeStartMem = this.timeStartInput && getTime(this.timeStartInput)
  }
  @Watch('timeEndInput', { immediate: true })
  private onTimeEndPropChange() {
    this.dateMem = this.timeEndInput && getDate(this.timeStartInput)
    this.timeEndMem = this.timeEndInput && getTime(this.timeEndInput)
  }

  @Watch('dateMem')
  @Watch('timeStartMem')
  private onTimeStartMemChange() {
    if (this.dateMem && this.timeStartMem) {
      this.timeStartInput = getIso8601(this.dateMem, this.timeStartMem)
    }
  }
  @Watch('dateMem')
  @Watch('timeEndMem')
  private onTimeEndMemChange() {
    if (this.dateMem && this.timeEndMem) {
      this.timeEndInput = getIso8601(this.dateMem, this.timeEndMem)
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
