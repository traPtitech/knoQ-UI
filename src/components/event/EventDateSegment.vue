<template>
  <v-card flat class="px-7 mt-n5 mb-5">
    <v-row>
      <v-col lg="2" cols="12" class="pt-8 mb-n7">
        <span class="title">{{ formattedDate }}</span>
      </v-col>
      <v-col>
        <v-list>
          <v-list-item-content
            v-for="(event, i) in events"
            :key="i"
            class="mb-n2"
          >
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
