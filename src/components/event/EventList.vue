<template>
  <div>
    <div v-if="!filteredEvents.length">
      <span class="text--secondary headline"> イベントがありません... </span>
    </div>
    <template v-for="(event, i) in filteredEvents" v-else>
      <div v-if="isDateBorder(i)" :key="event.timeStart" class="mb-1 headline">
        {{ formatDate(event.timeStart) }}
      </div>
      <EventListItem :key="event.eventId" :event="event" class="mb-5" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EventListItem from '@/components/event/EventListItem.vue'
import {
  formatDate as _formatDate,
  getDate,
  DATE_DISPLAY_FORMAT,
} from '@/workers/date'
import { ResponseEvent } from '@/api'

const props = defineProps<{
  events: ResponseEvent[]
  eventFilter: (e: ResponseEvent) => boolean
}>()

const filteredEvents = computed(() => props.events.filter(props.eventFilter))

const isDateBorder = computed(() => (i: number) => {
  if (i === 0) return true
  const e1 = filteredEvents.value[i - 1]
  const e2 = filteredEvents.value[i]
  return getDate(e1.timeStart) !== getDate(e2.timeStart)
})

const formatDate = _formatDate(DATE_DISPLAY_FORMAT)
</script>
