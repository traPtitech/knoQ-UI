<template>
  <v-dialog width="290px">
    <template #activator="{ on }">
      <v-text-field v-model="time" filled readonly v-bind="$attrs" v-on="on" />
    </template>
    <v-time-picker
      v-model="time"
      format="24hr"
      :allowed-minutes="v => !(v % 5)"
      v-bind="$attrs"
    />
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class TimePicker extends Vue {
  @Prop({ type: String, required: true })
  value!: string

  get time(): string {
    return this.value
  }
  set time(value: string) {
    this.$emit('input', value)
  }
}
</script>
