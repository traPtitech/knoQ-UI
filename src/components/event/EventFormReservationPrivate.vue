<template>
  <v-form v-model="_valid">
    <v-text-field
      v-model="placeSync"
      outlined
      label="場所"
      placeholder="チズケ2階"
      :rules="$rules.eventPlace"
    />
    <v-dialog width="290px">
      <template #activator="{ on }">
        <v-text-field
          v-model="dateMem"
          outlined
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

@Component({
  components: {
    TimePicker,
  },
})
export default class EventFormReservationPrivate extends Vue {
  @PropSync('place') placeSync!: string
  @PropSync('timeStart') timeStartSync!: string
  @PropSync('timeEnd') timeEndSync!: string
  @Prop() value!: boolean

  private dateMem = ''
  private timeStartMem = ''
  private timeEndMem = ''

  @Watch('timeStartSync')
  private onTimeStartPropChange() {
    this.dateMem = getDate(this.timeStartSync)
    this.timeStartMem = getTime(this.timeStartSync)
  }
  @Watch('timeEndSync')
  private onTimeEndPropChange() {
    this.dateMem = getDate(this.timeStartSync)
    this.timeEndMem = getTime(this.timeEndSync)
  }

  @Watch('dateMem')
  @Watch('timeStartMem')
  private onTimeStartMemChange() {
    if (this.dateMem && this.timeStartMem) {
      this.timeStartSync = getIso8601(this.dateMem, this.timeStartMem)
    }
  }
  @Watch('dateMem')
  @Watch('timeEndMem')
  private onTimeEndMemChange() {
    if (this.dateMem && this.timeEndMem) {
      this.timeEndSync = getIso8601(this.dateMem, this.timeEndMem)
    }
  }

  get dateMin(): string {
    return today()
  }

  get _valid(): boolean {
    return this.value
  }
  set _valid(value: boolean) {
    this.$emit('input', value)
  }
}
</script>
