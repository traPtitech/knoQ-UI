<template>
  <v-col>
    <calendar :height="784" :events="events" />
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import Calendar from '@/components/shared/Calendar.vue'

const EventsRepo = RepositoryFactory.get('events')

@Component({
  components: {
    Calendar,
  },
})
export default class CalendarPage extends Vue {
  events: Schemas.Event[] = []

  async created() {
    this.events = (await EventsRepo.get()).data
  }
}
</script>
