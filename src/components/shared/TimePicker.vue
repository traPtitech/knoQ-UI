<template>
  <v-dialog width="290px">
    <template #activator="{ on }">
      <v-text-field
        v-model="time"
        outlined
        readonly
        v-bind="$attrs"
        v-on="on"
      />
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
import 'reflect-metadata'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class TimePicker extends Vue {
  @Prop({ required: true }) value!: string

  get time(): string {
    return this.value
  }
  set time(value: string) {
    this.$emit('input', value)
  }
}
</script>
