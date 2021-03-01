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
          {{ $refs.calendar.title }}
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
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="focus"
        :type="type"
        :events="calendarEvents"
      ></v-calendar>
    </v-sheet>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import { formatDate } from '@/workers/date'

const EventsRepo = RepositoryFactory.get('events')

@Component
export default class Calendar extends Vue {
  events: Schemas.Event[] = []
  calendarEvents: {
    name: string
    start: string
    end: string
  }[] = []

  focus = ''
  type = 'month'

  typeToLabel = {
    month: 'Month',
    week: 'Week',
    day: 'Day',
    '4day': '4 Days',
  }

  async created() {
    this.events = await this.fetchEvents()
    this.calendarEvents = this.events.map(event => ({
      name: event.name,
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
}
</script>
