<template>
  <v-list class="overflow-y-auto" max-height="85vh" color="transparent">
    <template v-for="(event, i) in filteredEvents">
      <v-list-item v-if="isDateBorder(i)" :key="event.date" class="mt-4 mb-n2">
        <span class="title">{{ formatDateStr(event.date) }}</span>
      </v-list-item>
      <v-list-item :key="i">
        <v-list-item-content>
          <EventListItem v-bind="event" />
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import EventListItem from '@/components/event/EventListItem.vue'
import { momentify, compareDateStr } from '@/utils/date'

interface Event {
  id: number
  date: string
  timeStart: string
  timeEnd: string
  place: string
  title: string
}

@Component({
  components: {
    EventListItem,
  },
})
export default class EventList extends Vue {
  @Prop() events!: Event[]
  @Prop() eventFilter?: (e: Event) => boolean

  isDateBorder(i: number) {
    return !(
      i > 0 && this.filteredEvents[i - 1].date == this.filteredEvents[i].date
    )
  }

  get filteredEvents() {
    return this.events
      .sort((e1, e2) => compareDateStr(e1.date, e2.date))
      .filter(this.eventFilter || (_ => true))
  }

  formatDateStr(date: string) {
    return momentify(date).format('ll')
  }
}
</script>
