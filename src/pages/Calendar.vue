<template>
  <v-col>
    <v-sheet height="64">
      <v-toolbar flat>
        <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
          Today
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="prev">
          <v-icon small> mdi-chevron-left </v-icon>
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon small> mdi-chevron-right </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ calendarTitle }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu bottom right>
          <template #activator="{ on, attrs }">
            <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right> mdi-menu-down </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = '4day'">
              <v-list-item-title>4 days</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="720">
      <v-calendar
        ref="calendar"
        v-model="focus"
        :type="type"
        :events="calendarEvents"
        :event-color="getEventColor"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
      ></v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card
          v-if="selectedEvent"
          color="grey lighten-4"
          min-width="350px"
          flat
        >
          <v-toolbar :color="selectedEvent.color" dark>
            <v-btn
              v-if="isMyEvent(selectedEvent)"
              icon
              :to="`/events/edit/${selectedEvent.eventId}`"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-toolbar-title>
              <router-link :to="`/events/${selectedEvent.eventId}`">
                {{ selectedEvent.name }}
              </router-link>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <MarkdownField :src="selectedEvent.description" />
          </v-card-text>
          <v-card-actions>
            <v-btn text color="secondary" @click="selectedOpen = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import { formatDate } from '@/workers/date'
import MarkdownField from '@/components/shared/MarkdownField.vue'

const EventsRepo = RepositoryFactory.get('events')

type calendarEvent = {
  eventId: string
  name: string
  description: string
  start: string
  end: string
  admins: string[]
  color: string
}

@Component({
  components: {
    MarkdownField,
  },
})
export default class Calendar extends Vue {
  events: Schemas.Event[] = []

  calendarEvents: calendarEvent[] = []

  focus = ''
  type = 'month'

  selectedEvent: calendarEvent | null = null
  selectedElement = null
  selectedOpen = false

  typeToLabel = {
    month: 'Month',
    week: 'Week',
    day: 'Day',
    '4day': '4 Days',
  }

  colors = [
    'blue',
    'indigo',
    'deep-purple',
    'cyan',
    'green',
    'orange',
    'grey darken-1',
    'red',
  ]

  async created() {
    this.events = await this.fetchEvents()
    this.calendarEvents = this.events.map(event => ({
      eventId: event.eventId,
      name: event.name,
      description: event.description,
      admins: event.admins,
      color: this.colors[parseInt(event.groupId[0], 16) % 8],
      start: formatDate('YYYY-MM-DD HH:mm')(event.timeStart),
      end: formatDate('YYYY-MM-DD HH:mm')(event.timeEnd),
    }))
  }

  async fetchEvents() {
    return (await EventsRepo.get()).data
  }

  prev() {
    ;(this.$refs.calendar as any).prev()
  }
  next() {
    ;(this.$refs.calendar as any).next()
  }
  setToday() {
    this.focus = ''
  }

  showEvent({ nativeEvent, event }) {
    const open = () => {
      this.selectedEvent = event
      this.selectedElement = nativeEvent.target
      setTimeout(() => {
        this.selectedOpen = true
      }, 10)
    }

    if (this.selectedOpen) {
      this.selectedOpen = false
      setTimeout(open, 10)
    } else {
      open()
    }

    nativeEvent.stopPropagation()
  }
  viewDay({ date }) {
    this.focus = date
    this.type = 'day'
  }

  getEventColor(event) {
    return event.color
  }

  get calendarTitle() {
    return (this.$refs.calendar as any).title
  }
  get isMyEvent(): (event: calendarEvent) => boolean {
    return (event: calendarEvent) => {
      return (
        event?.admins.includes(this.$store.direct.state.me?.userId ?? '') ??
        false
      )
    }
  }
}
</script>
