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
    <v-card-text
      ><MarkdownField :src="event.description" class="markdown-field"
    /></v-card-text>
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

<script setup lang="ts">
import EventTag from '@/components/shared/EventTag.vue'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import {
  formatDate as _formatDate,
  DATETIME_DISPLAY_FORMAT,
} from '@/workers/date'
import { ResponseEvent } from '@/api'

defineProps<{
  event: ResponseEvent
}>()

const formatDate = _formatDate(DATETIME_DISPLAY_FORMAT)
</script>
<style scoped>
.markdown-field {
  padding-top: 4px;
  max-height: 200px;
  overflow: auto;
}
</style>
