<template>
  <v-card elevation="4" style="width: 100%;" class="px-3 py-1">
    <v-card-title class="headline">{{ name }}</v-card-title>
    <v-card-subtitle>
      <div>
        {{ formatDate(timeStart) }}
        <v-icon small style="margin-bottom: 3px;">mdi-chevron-right</v-icon>
        {{ formatDate(timeEnd) }}
      </div>
      <div>@{{ place }}</div>
    </v-card-subtitle>
    <v-card-text class="text-truncate">{{ description }}</v-card-text>
    <v-card-actions class="px-4">
      <v-row dense>
        <v-col lg="" cols="12">
          <EventTag
            v-for="tag in tags"
            :key="tag.name"
            :name="tag.name"
            class="mr-3"
          />
        </v-col>
        <v-col lg="" cols="12" class="flex-grow-0">
          <v-btn depressed color="primary" :to="`/events/${eventId}`">
            LEARN MORE
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import TrapAvatar from '@/components/shared/TrapAvatar.vue'
import EventTag from '@/components/shared/EventTag.vue'
import { DATETIME_FORMAT } from '@/workers/date'
import moment from 'moment'

@Component({
  components: {
    TrapAvatar,
    EventTag,
  },
})
export default class EventListItem extends Vue {
  @Prop() eventId: number
  @Prop() name: string
  @Prop() timeStart: string
  @Prop() timeEnd: string
  @Prop() place: string
  @Prop() description: string
  @Prop() tags: { name: string }[]

  get formatDate() {
    return (date: string) => moment(date).format(DATETIME_FORMAT)
  }
}
</script>
