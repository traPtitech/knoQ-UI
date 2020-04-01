<template>
  <div>
    <span class="text--secondary headline">
      <template v-if="status === 'loading'">
        Loading...
      </template>
      <template v-else-if="status === 'error'">
        Could not load data...
      </template>
      <template v-else-if="!allEventData.length">
        No events today!!
      </template>
    </span>
    <template v-if="!!allEventData.length">
      <EventListItem
        v-for="event in allEventData"
        :key="event.id"
        class="mb-5"
        v-bind="event"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import EventListItem from '@/components/event/EventListItem.vue'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
import moment from 'moment'

const EventsRepo = RepositoryFactory.get('events')
const RoomsRepo = RepositoryFactory.get('rooms')

@Component({
  components: {
    EventListItem,
  },
})
export default class EventListToday extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  events: Schemas.Event[] | null = null
  rooms: Map<string, Schemas.Room> | null = null

  async created() {
    this.status = 'loading'
    try {
      await Promise.all([this.fetchEvents(), this.fetchRooms()])
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }

  async fetchEvents() {
    const today = moment().format()
    this.events = (await EventsRepo.get({
      dateBegin: today,
      dateEnd: today,
    })).data
  }
  async fetchRooms() {
    const rooms = new Map<string, Schemas.Room>()
    const today = moment().format()
    const { data } = await RoomsRepo.get({ dateBegin: today, dateEnd: today })
    data.forEach(room => rooms.set(room.roomId, room))
    this.rooms = rooms
  }

  get allEventData() {
    if (!this.events || !this.rooms) return []
    return this.events
      .sort((e1, e2) => (e1.timeStart < e2.timeStart ? -1 : 1))
      .map(event => ({ ...event, place: this.rooms.get(event.roomId).place }))
  }
}
</script>
