<template>
  <v-col>
    <calendar
      :height="784"
      :events="events"
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
  events: ResponseEvent[] = []

  async created() {
    await this.fetchMonthlyEvents(new Date())
  }

  async fetchMonthlyEvents(newDate) {
    const startDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1)
    const endDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0)
    this.events = await api.events.getEvents({
      dateBegin: startDate.toISOString(),
      dateEnd: endDate.toISOString(),
    })
  }
}
</script>
