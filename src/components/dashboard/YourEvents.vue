<template>
  <div v-if="status === 'loading'">
    読み込み中...
  </div>
  <div v-else-if="status === 'error'">
    データを読み込めませんでした...
  </div>
  <v-card v-else class="px-3">
    <v-list>
      <v-list-item v-if="!events.length">
        <span class="text--secondary">
          あなたの作成したイベントはありません
        </span>
      </v-list-item>
      <template v-for="(event, i) in allEventData">
        <v-list-item :key="event.eventId">
          <v-row align="center" style="width: 100%;">
            <v-col class="flex-grow-0 text-no-wrap text--secondary">
              {{ event.date }}
            </v-col>
            <v-col class="text-truncate">
              <router-link :to="`/events/${event.eventId}`">
                {{ event.name }}
              </router-link>
            </v-col>
            <v-col class="flex-grow-0">
              <v-btn
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
      <v-list-item>
        <v-list-item-content>
          <v-btn depressed color="primary" to="/events/new">
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
import RepositoryFactory from '@/repositories/RepositoryFactory'
import { formatDate, today } from '@/workers/date'

const UsersRepo = RepositoryFactory.get('users')

@Component
export default class YourEvents extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  events: Schemas.Event[] | null = null

  async created() {
    this.status = 'loading'
    try {
      await this.fetchEvents()
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }

  async fetchEvents() {
    this.events = (await UsersRepo.me.events.get()).data.filter(event => {
      return today() <= event.timeStart
    })
  }

  get allEventData() {
    if (!this.events) return []
    return this.events.map(event => ({
      eventId: event.eventId,
      name: event.name,
      date: formatDate('MM/DD')(event.timeStart),
    }))
  }
}
</script>
