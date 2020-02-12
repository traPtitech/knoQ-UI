<template>
  <Layout>
    <h1 class="mb-5 display-1 font-weight-bold">Events</h1>
    <EventList :events="events" />
  </Layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Layout from '@/components/shared/Layout.vue'
import EventList from '@/components/event/EventList/EventList.vue'

@Component({
  components: {
    Layout,
    EventList,
  },
})
export default class Events extends Vue {
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
      id: 4,
      date: '2019-12-31',
      timeStart: '17:00',
      timeEnd: '20:00',
      place: 'place3',
      title: 'event3',
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
      id: 3,
      date: '2020-1-1',
      timeStart: '12:00',
      timeEnd: '16:30',
      place: 'place5',
      title: 'event5',
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
      id: 9,
      date: '2020-1-1',
      timeStart: '9:00',
      timeEnd: '12:00',
      place: 'place4',
      title: 'event4',
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
      id: 8,
      date: '2020-1-3',
      timeStart: '17:00',
      timeEnd: '20:00',
      place: 'place8',
      title: 'event8',
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
}
</script>
