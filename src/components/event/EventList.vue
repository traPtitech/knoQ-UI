<template>
  <div>
    <div v-if="!filteredEvents.length" class="text-center">
      <span class="text--secondary headline">
        There is no event...
      </span>
    </div>
    <template v-for="(event, i) in filteredEvents" v-else>
      <div v-if="isDateBorder(i)" :key="event.date" class="mb-1 headline">
        {{ formatDateStr(event.date) }}
      </div>
      <EventListItem :key="event.id" v-bind="event" class="mb-5" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import EventListItem from '@/components/event/EventListItem.vue'
import { momentify } from '@/utils/date'

@Component({
  components: {
    EventListItem,
  },
})
export default class EventList extends Vue {
  @Prop() events!: any[]
  @Prop() eventFilter?: (e: any) => boolean

  get filteredEvents() {
    return this.events.filter(this.eventFilter || (_ => true))
  }

  get isDateBorder() {
    return (i: number) =>
      !(
        i > 0 && this.filteredEvents[i - 1].date === this.filteredEvents[i].date
      )
  }

  get formatDateStr() {
    return (date: string) => momentify(date).format('ll')
  }
}
</script>
