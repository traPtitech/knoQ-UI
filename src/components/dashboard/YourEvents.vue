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
            所属するグループや，出席するイベントはありません
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

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { formatDate, today } from '@/workers/date'
import api, { ResponseEvent, GetMyEventsRelationEnum } from '@/api'

const uniqueBy = <T, S>(f: (x: T) => S, arr: T[]): T[] => {
  return [...new Map(arr.map(x => [f(x), x])).values()]
}

@Component
export default class YourEvents extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  events: ResponseEvent[] = []

  async created() {
    this.status = 'loading'
    try {
      const [adminEvents, belongingEvents] = await Promise.all([
        api.events.getMyEvents({ 
          relation: GetMyEventsRelationEnum.Admins,
          dateBegin: today()
        }),
        api.events.getMyEvents({ 
          relation: GetMyEventsRelationEnum.Belongs,
          dateBegin: today()
        }),
      ])
      this.events = uniqueBy(
        event => event.eventId,
        [...adminEvents, ...belongingEvents]
      )
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }

  get includesMe() {
    return (memberIds: string[]) =>
      memberIds.includes(this.$store.direct.state.me?.userId ?? '')
  }

  get formatDate() {
    return formatDate('MM/DD')
  }
}
</script>
