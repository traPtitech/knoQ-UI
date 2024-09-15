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

<script setup lang="ts">
import { formatDate as _formatDate, TIME_DISPLAY_FORMAT } from '@/workers/date'
import { ResponseRoom } from '@/api'

defineProps<{
  room: ResponseRoom
}>()

const formatDate = _formatDate(TIME_DISPLAY_FORMAT)
</script>
