<template>
  <div>
    <v-sheet :height="status === 'loading' ? 60 : 64">
      <v-toolbar flat>
        <v-btn
          outlined
          class="mr-4"
          color="grey darken-2"
          @click="jumpToCurrentDate"
        >
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
        <v-spacer />
        <v-menu bottom right>
          <template #activator="{ on, attrs }">
            <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right> mdi-menu-down </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>{{ typeToLabel['day'] }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = '4day'">
              <v-list-item-title>{{ typeToLabel['4day'] }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>{{ typeToLabel['week'] }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>{{ typeToLabel['month'] }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>
    <v-progress-linear
      v-if="status == 'loading'"
      indeterminate
      color="primary"
    ></v-progress-linear>
    <v-sheet :height="height - 64">
      <v-calendar
        :ref="calendarRefName"
        v-model="focus"
        :type="type"
        :events="calendarEvent"
        :event-color="getEventColor"
        color="calendarToday"
        :month-format="() => ''"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
        @input="onMonthChange"
      />

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
          <v-toolbar color="grey lighten-4" dark flat>
            <v-toolbar-title>
              <router-link :to="`/events/${selectedEvent.eventId}`">
                {{ selectedEvent.name }}
              </router-link>
            </v-toolbar-title>
            <v-spacer />
            <v-btn
              v-if="isMyEvent(selectedEvent)"
              icon
              :to="`/events/edit/${selectedEvent.eventId}`"
            >
              <v-icon color="grey">mdi-pencil</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <p v-if="!selectedEvent.description">No description provided.</p>
            <markdown-field v-else :src="selectedEvent.description" />
          </v-card-text>
          <v-card-actions>
            <v-btn text color="secondary" @click="selectedOpen = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { formatDate } from '@/workers/date'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import { ResponseEvent } from '@/api'

type CalendarEvent = {
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
  @Prop({ type: Number, required: true })
  height!: number

  @Prop({ type: Array, default: [] })
  events!: ResponseEvent[]

  @Prop({ type: String, default: 'loading' })
  status!: 'loading' | 'loaded' | 'error'

  focus = ''
  type = 'month'

  selectedEvent: CalendarEvent | null = null
  selectedElement = null
  selectedOpen = false

  typeToLabel = {
    month: 'Month',
    week: 'Week',
    '4day': '4 Days',
    day: 'Day',
  }

  calendarRefName = 'calendar'
  get calendarRef() {
    return this.$refs[this.calendarRefName] as any
  }
  get calendarTitle() {
    return this.calendarRef?.title
  }

  prev() {
    this.calendarRef?.prev()
  }
  next() {
    this.calendarRef?.next()
  }
  jumpToCurrentDate() {
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

  get calendarEvent(): CalendarEvent[] {
    const idToColor = (id: string) =>
      [
        'blue',
        'indigo',
        'deep-purple',
        'cyan',
        'green',
        'orange',
        'grey darken-1',
        'red',
      ][parseInt(id[0], 16) % 8]
    const toVCalendarDateFormat = formatDate('YYYY-MM-DD HH:mm')

    return this.events.map(event => ({
      eventId: event.eventId,
      name: event.name,
      description: event.description,
      admins: event.admins,
      color: idToColor(event.groupId),
      start: toVCalendarDateFormat(event.timeStart),
      end: toVCalendarDateFormat(event.timeEnd),
    }))
  }
  getEventColor(event: CalendarEvent) {
    return event.color
  }

  get isMyEvent() {
    return (event: CalendarEvent) =>
      event?.admins.includes(this.$store.direct.state.me?.userId ?? '') ?? false
  }
  onMonthChange(value) {
    value = new Date(value)
    this.$emit('monthChanged', value)
  }
}
</script>

<style lang="scss">
.v-calendar-weekly__day-label {
  margin-bottom: 4px;
  & > .v-btn {
    width: 28px;
    height: 28px;
    &.calendarToday {
      & > .v-btn__content {
        color: white;
      }
    }
  }
}
.v-calendar-daily_head-day-label {
  & > .v-btn {
    &.calendarToday {
      & > .v-btn__content {
        color: white;
      }
    }
  }
}
</style>
