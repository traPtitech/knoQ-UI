<template>
  <v-container>
    <v-autocomplete
      v-model="filterTags"
      :items="tags"
      placeholder="Filter by tags"
      chips
      clearable
      multiple
      solo
      prepend-inner-icon="mdi-filter"
    >
      <template #selection="{ item }">
        <EventTag close :name="item" @click:close="removeFilterTag(item)" />
      </template>
    </v-autocomplete>
    <v-checkbox
      v-model="showFinished"
      label="過去のイベントも表示"
      class="mt-n6"
    />
    <EventList :events="sortedEvents" :event-filter="filterFn" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import EventList from '@/components/event/EventList.vue'
import EventTag from '@/components/shared/EventTag.vue'
import { compareDateStr } from '@/workers/date'

@Component({
  components: {
    EventList,
    EventTag,
  },
})
export default class EventSearch extends Vue {
  filterTags: string[] = []
  showFinished = false

  get filterFn() {
    return e =>
      [
        e => this.showFinished || compareDateStr(e.date) >= 0,
        e => this.filterTags.every(t => e.tags.includes(t)),
      ].every(p => p(e))
  }

  removeFilterTag(name: string) {
    const index = this.filterTags.indexOf(name)
    if (index >= 0) this.filterTags.splice(index, 1)
  }

  tags = ['react', 'vue', 'angular', 'haskell', 'purescript', 'riot']
  events = [
    {
      id: 1,
      date: '2020-03-05',
      timeStart: '15:00',
      timeEnd: '20:00',
      place: 'place1',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      title: 'event1',
      tags: ['react', 'haskell', 'purescript', 'vue'],
    },
    {
      id: 2,
      date: '2020-03-27',
      timeStart: '17:00',
      timeEnd: '20:00',
      place: 'place2',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      title: 'event2',
      tags: ['react', 'vue', 'purescript'],
    },
    {
      id: 4,
      date: '2020-03-31',
      timeStart: '17:00',
      timeEnd: '20:00',
      place: 'place3',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      title: 'event3',
      tags: ['react', 'haskell', 'purescript'],
    },
    {
      id: 7,
      date: '2020-1-3',
      timeStart: '15:00',
      timeEnd: '20:00',
      place: 'place7',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      title: 'event7',
      tags: ['react', 'haskell', 'purescript'],
    },
    {
      id: 3,
      date: '2020-1-1',
      timeStart: '03:00',
      timeEnd: '16:30',
      place: 'place5',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      title: 'event5',
      tags: ['react', 'haskell'],
    },
    {
      id: 6,
      date: '2020-1-1',
      timeStart: '15:00',
      timeEnd: '20:00',
      place: 'place6',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      title: 'event6',
      tags: ['react', 'haskell', 'purescript'],
    },
    {
      id: 9,
      date: '2020-1-1',
      timeStart: '9:00',
      timeEnd: '03:00',
      place: 'place4',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      title: 'event4',
      tags: ['react', 'haskell', 'riot'],
    },
    {
      id: 5,
      date: '2020-1-3',
      timeStart: '18:00',
      timeEnd: '20:00',
      place: 'place9',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      title: 'event9',
      tags: ['react', 'haskell', 'purescript'],
    },
    {
      id: 8,
      date: '2020-1-3',
      timeStart: '17:00',
      timeEnd: '20:00',
      place: 'place8',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      title: 'event8',
      tags: ['react', 'haskell', 'purescript'],
    },
    {
      id: 10,
      date: '2020-1-3',
      timeStart: '18:30',
      timeEnd: '20:00',
      place: 'place10',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      title: 'event10',
      tags: ['react', 'haskell', 'purescript', 'riot'],
    },
  ]

  get sortedEvents() {
    return this.events.sort((e1, e2) => compareDateStr(e1.date, e2.date))
  }
}
</script>
