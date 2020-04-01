<template>
  <div>
    <div v-if="!filteredEvents.length">
      <span class="text--secondary headline">
        There is no event...
      </span>
    </div>
    <template v-for="(event, i) in filteredEvents" v-else>
      <div v-if="isDateBorder(i)" :key="event.date" class="mb-1 headline">
        {{ formatDateStr(event.timeStart) }}
      </div>
      <EventListItem :key="event.id" v-bind="event" class="mb-5" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import EventListItem from '@/components/event/EventListItem.vue'
import { getDateStr, DATE_FORMAT } from '@/workers/date'
import moment from 'moment'

interface EventData extends Schemas.Event {
  place: string
}

@Component({
  components: {
    EventListItem,
  },
})
export default class EventList extends Vue {
  @Prop() events!: EventData[]
  @Prop() eventFilter?: (e: any) => boolean

  get filteredEvents() {
    return this.events.filter(this.eventFilter || (_ => true))
  }

  get isDateBorder() {
    return (i: number) => {
      if (i === 0) return true
      const e1 = this.filteredEvents[i - 1]
      const e2 = this.filteredEvents[i]
      return (
        moment(e1.timeStart).format('YYYYMMDD') !==
        moment(e2.timeStart).format('YYYYMMDD')
      )
    }
  }

  get formatDateStr() {
    return (date: string) => moment(date).format(DATE_FORMAT)
  }
}
</script>
