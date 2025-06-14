<template>
  <v-col>
    <calendar
      :height="784"
      :events="events"
      :status="status"
      @monthChanged="fetchMonthlyEvents"
    />
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Calendar from '@/components/shared/Calendar.vue'
import api, { ResponseEvent } from '@/api'

@Component({
  components: {
    Calendar,
  },
})
export default class CalendarPage extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  events: ResponseEvent[] = []

  async created() {
    await this.fetchMonthlyEvents(new Date())
  }

  async fetchMonthlyEvents(newDate) {
    this.status = 'loading'
    this.events = []
    const startDate = new Date(newDate.getFullYear(), newDate.getMonth() - 1, 1)
    const endDate = new Date(newDate.getFullYear(), newDate.getMonth() + 2, 0, 23, 59, 59)
    try {
      this.events = await api.events.getEvents({
        dateBegin: startDate.toISOString(),
        dateEnd: endDate.toISOString(),
      })
      this.status = 'loaded'
    } catch (e) {
      this.status = 'error'
    }
  }
}
</script>
