<template>
  <div>
    <span class="text--secondary">
      <template v-if="status === 'loading'"> 読み込み中... </template>
      <template v-else-if="status === 'error'">
        データを読み込めませんでした...
      </template>
      <template v-else-if="!events.length">
        今日のイベントがありません
      </template>
    </span>
    <template v-if="!!events.length">
      <EventListItem
        v-for="event in events"
        :key="event.eventId"
        class="mb-5"
        :event="event"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EventListItem from '@/components/event/EventListItem.vue'
import { today, todayEnd } from '@/workers/date'
import api, { ResponseEvent } from '@/api'

const status = ref<'loading' | 'loaded' | 'error'>('loading')
const events = ref<ResponseEvent[]>([])

;(async () => {
  try {
    events.value = await api.events.getEvents({
      dateBegin: today(),
      dateEnd: todayEnd(),
    })
    status.value = 'loaded'
  } catch (__) {
    status.value = 'error'
  }
})()
</script>
