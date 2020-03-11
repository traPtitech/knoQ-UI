<template>
  <v-list color="transparent">
    <v-list-item v-for="event in events" :key="event.id" class="px-0 mb-5">
      <EventListItem v-bind="event" />
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import EventListItem from '@/components/event/EventListItem.vue'

@Component({
  components: {
    EventListItem,
  },
})
export default class EventListToday extends Vue {
  events = [
    {
      id: 1,
      date: '2019-12-31',
      timeStart: '3:00 pm',
      timeEnd: '8:00 pm',
      place: 'place1',
      title: 'event1',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      tags: ['react', 'haskell', 'purescript'],
    },
    {
      id: 2,
      date: '2019-12-31',
      timeStart: '5:00 pm',
      timeEnd: '8:00 pm',
      place: 'place2',
      title: 'event2',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      tags: ['react', 'vue', 'angular'],
    },
    {
      id: 4,
      date: '2019-12-31',
      timeStart: '5:00 pm',
      timeEnd: '8:00 pm',
      place: 'place3',
      title: 'event3',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      tags: ['react', 'haskell', 'purescript'],
    },
  ]
}
</script>
