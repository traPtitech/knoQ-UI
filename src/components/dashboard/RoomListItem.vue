<template>
  <v-card class="py-3">
    <v-card-title class="d-block text-center display-1">
      {{ room.place }}
    </v-card-title>
    <v-card-text class="text-center title font-weight-regular">
      {{ formatDate(room.timeStart) }}
      <v-icon class="mb-1">mdi-chevron-right</v-icon>
      {{ formatDate(room.timeEnd) }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { formatDate, TIME_DISPLAY_FORMAT } from '@/workers/date'
import { ResponseRoom } from '@/api'

@Component
export default class AssignedRoomDisplay extends Vue {
  @Prop({ type: Object, required: true })
  room!: ResponseRoom

  get formatDate() {
    return formatDate(TIME_DISPLAY_FORMAT)
  }
}
</script>
