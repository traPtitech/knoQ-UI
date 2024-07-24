<template>
  <v-card class="px-3">
    <v-list>
      <v-list-item v-if="status === 'loading'">
        <span class="text--secondary"> 読み込み中 </span>
      </v-list-item>
      <v-list-item v-else-if="status === 'error'">
        <span class="text--secondary"> データを読み込めませんでした... </span>
      </v-list-item>
      <template v-else>
        <v-list-item v-if="!events.length">
          <span class="text--secondary">
            あなたの作成したイベントはありません
          </span>
        </v-list-item>
        <template v-for="(event, i) in events">
          <v-list-item :key="event.eventId">
            <v-row align="center" style="width: 100%">
              <v-col class="flex-grow-0 text-no-wrap text--secondary">
                {{ formatDate(event.timeStart) }}
              </v-col>
              <v-col class="text-truncate">
                <router-link :to="`/events/${event.eventId}`">
                  {{ event.name }}
                </router-link>
              </v-col>
              <v-col class="flex-grow-0">
                <v-btn
                  v-if="includesMe(event.admins)"
                  small
                  outlined
                  color="primary"
                  :to="`/events/edit/${event.eventId}`"
                >
                  編集
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item>
          <v-divider :key="i" />
        </template>
      </template>
      <v-list-item>
        <v-list-item-content>
          <v-btn depressed block color="primary" to="/events/new">
            <v-icon small>mdi-plus</v-icon>
            新しいイベントを作成
          </v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { formatDate as _formatDate, today } from '@/workers/date'
import api, { ResponseEvent, GetMyEventsRelationEnum } from '@/api'
import { ref } from 'vue'
import { useStore } from '@/workers/store'

const uniqueBy = <T, S>(f: (x: T) => S, arr: T[]): T[] => {
  return [...new Map(arr.map(x => [f(x), x])).values()]
}
const store = useStore()

const status = ref<'loading' | 'loaded' | 'error'>('loading')
const events = ref<ResponseEvent[]>([])

;(async () => {
  status.value = 'loading'
  try {
    const [adminEvents, belongingEvents] = await Promise.all([
      api.events.getMyEvents({ relation: GetMyEventsRelationEnum.Admins }),
      api.events.getMyEvents({ relation: GetMyEventsRelationEnum.Belongs }),
    ])
    events.value = uniqueBy(
      event => event.eventId,
      [...adminEvents, ...belongingEvents]
    ).filter(event => today() <= event.timeStart)
    status.value = 'loaded'
  } catch (__) {
    status.value = 'error'
  }
})()

const includesMe = (memberIds: string[]) =>
  memberIds.includes(store.direct.state.me?.userId ?? '')

const formatDate = _formatDate('MM/DD')
</script>
