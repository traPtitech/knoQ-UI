<template>
  <v-card flat class="px-7">
    <v-row>
      <v-col cols="1" class="pt-8">
        <span class="title">{{ formattedDate }}</span>
      </v-col>
      <v-col>
        <v-list>
          <v-list-item-content v-for="(event, i) in events" :key="i">
            <EventTape v-bind="event" />
          </v-list-item-content>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import moment from 'moment'
import EventTape from '@/components/event/EventTape.vue'

@Component({
  components: {
    EventTape,
  },
})
export default class EventDateSegment extends Vue {
  @Prop()
  date: string

  @Prop()
  events

  get formattedDate(): string {
    return moment(this.date).format('MMM D')
  }
}
</script>
