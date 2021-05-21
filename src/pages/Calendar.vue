<template>
  <v-col>
    <calendar :height="784" :events="events" />
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
    this.events = await api.events.getEvents({})
  }
}
</script>
