<template>
  <v-list class="overflow-y-auto" max-height="85vh">
    <EventDateSegment
      v-for="[date, events] in eventsSplittedByDate"
      :key="date"
      :date="date"
      :events="events"
    />
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import EventDateSegment from '@/components/event/EventList/EventDateSegment.vue'
import { groupBy } from '@/utils/arrayUtil'

@Component({
  components: {
    EventDateSegment,
  },
})
export default class EventList extends Vue {
  events = [
    {
      id: 1,
      date: '2019-12-31',
      timeStart: '15:00',
      timeEnd: '20:00',
      place: 'place1',
      title: 'event1',
    },
    {
      id: 2,
      date: '2019-12-31',
      timeStart: '17:00',
      timeEnd: '20:00',
      place: 'place2',
      title: 'event2',
    },
    {
      id: 3,
      date: '2020-1-1',
      timeStart: '12:00',
      timeEnd: '16:30',
      place: 'place5',
      title: 'event5555555555555555555',
    },
    {
      id: 4,
      date: '2019-12-31',
      timeStart: '17:00',
      timeEnd: '20:00',
      place: 'place3',
      title: 'event3',
    },
    {
      id: 5,
      date: '2020-1-3',
      timeStart: '18:00',
      timeEnd: '20:00',
      place: 'place9',
      title: 'event9',
    },
    {
      id: 6,
      date: '2020-1-1',
      timeStart: '15:00',
      timeEnd: '20:00',
      place: 'place6',
      title: 'event6',
    },
    {
      id: 7,
      date: '2020-1-3',
      timeStart: '15:00',
      timeEnd: '20:00',
      place: 'place7',
      title: 'event7',
    },
    {
      id: 8,
      date: '2020-1-3',
      timeStart: '17:00',
      timeEnd: '20:00',
      place: 'place8',
      title: 'event8',
    },
    {
      id: 9,
      date: '2020-1-1',
      timeStart: '9:00',
      timeEnd: '12:00',
      place: 'place4',
      title: 'event4',
    },
    {
      id: 10,
      date: '2020-1-3',
      timeStart: '18:30',
      timeEnd: '20:00',
      place: 'place10',
      title: 'event10',
    },
  ]

  get filteredEvents() {
    return this.events.filter(_ => true)
  }

  get eventsSplittedByDate() {
    return groupBy(
      a => a.date,
      this.filteredEvents.sort(
        (a, b) =>
          new Date(`${a.date} ${a.timeStart}`).getTime() -
          new Date(`${b.date} ${b.timeStart}`).getTime()
      )
    )
  }
}
</script>
