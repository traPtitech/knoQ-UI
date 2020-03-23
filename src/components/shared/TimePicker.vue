<template>
  <v-dialog width="290px">
    <template #activator="{ on }">
      <v-text-field
        v-model="time"
        outlined
        :label="label"
        readonly
        :rules="rules"
        :disabled="disabled"
        v-on="on"
      />
    </template>
    <v-time-picker
      v-model="time"
      :allowed-minutes="v => !(v % 5)"
      :min="min || ''"
      :max="max || ''"
    />
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class TimePicker extends Vue {
  @Prop() value: string
  @Prop() label: string
  @Prop({ default: [] }) rules: ((v: string) => boolean | string)[]
  @Prop({ default: false }) disabled: boolean
  @Prop() min: string
  @Prop() max: string

  get time(): string {
    return this.value
  }
  set time(value: string) {
    this.$emit('input', value)
  }
}
</script>
