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

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import EventListItem from '@/components/event/EventListItem.vue'
import { today, todayEnd } from '@/workers/date'
import api, { ResponseEvent } from '@/api'

@Component({
  components: {
    EventListItem,
  },
})
export default class EventListToday extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  events: ResponseEvent[] = []

  async created() {
    this.status = 'loading'
    try {
      this.events = await api.events.getEvents({
        dateBegin: today(),
        dateEnd: todayEnd(),
      })
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }
}
</script>
