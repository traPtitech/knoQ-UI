<template>
  <v-card elevation="4" style="width: 100%" class="px-3 py-1">
    <v-card-title class="headline">{{ event.name }}</v-card-title>
    <v-card-subtitle>
      <div>
        {{ formatDate(event.timeStart) }}
        <v-icon small style="margin-bottom: 3px">mdi-chevron-right</v-icon>
        {{ formatDate(event.timeEnd) }}
      </div>
      <div>@{{ event.place }}</div>
    </v-card-subtitle>
    <v-card-text class="text-truncate">{{ event.description }}</v-card-text>
    <v-card-actions class="px-4">
      <v-row dense>
        <v-col sm="" cols="12">
          <EventTag
            v-for="tag in event.tags"
            :key="tag.name"
            to-tag-page-on-click
            :name="tag.name"
            class="mr-3"
          />
        </v-col>
        <v-col sm="" cols="12" class="flex-grow-0">
          <v-btn depressed color="primary" :to="`/events/${event.eventId}`">
            詳細を見る
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
import { formatDate, DATETIME_DISPLAY_FORMAT } from '@/workers/date'
import { ResponseEvent } from '@/api'

@Component({
  components: {
    TrapAvatar,
    EventTag,
  },
})
export default class EventListItem extends Vue {
  @Prop({ type: Object, required: true })
  event!: ResponseEvent

  get formatDate() {
    return formatDate(DATETIME_DISPLAY_FORMAT)
  }
}
</script>
