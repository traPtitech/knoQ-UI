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
      label="room"
      placeholder="available rooms"
      v-model="_room"
      :loading="loading"
      :items="roomsList"
      :rules="eventRoomRules"
      class="mb-5"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, PropSync } from 'vue-property-decorator'
import Rules from '@/utils/rules'

@Component
export default class EventReservationForm extends Vue {
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

  eventRoomRules = Rules.eventRoom
}
</script>
