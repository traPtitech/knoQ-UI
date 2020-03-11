<template>
  <v-form v-model="valid">
    <div>
      <div>Select dates</div>
      <v-date-picker
        v-model="date"
        show-current
        full-width
        landscape
        multiple
        class="mb-5 elevation-0"
      />
    </div>
    <v-autocomplete
      v-model="_room"
      label="room"
      placeholder="available rooms"
      :loading="loading"
      :items="roomsList"
      :rules="$rules.eventRoom"
      class="mb-5"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, PropSync } from 'vue-property-decorator'

@Component
export default class EventFormReservation extends Vue {
  @Prop() value: boolean
  @PropSync('room') _room: string

  date: string[] = []

  roomsList = ['S512: Jan 1, 10:00 ~ 12:00', 'H101: Jan 8, 17:00 ~ 18:00']

  loading = true

  private get valid(): boolean {
    return this.value
  }
  private set valid(value: boolean) {
    this.$emit('input', value)
  }
}
</script>
