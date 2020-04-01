<template>
  <div v-if="status === 'loading'">
    Loading...
  </div>
  <div v-else-if="status === 'error'">
    Could not load data...
  </div>
  <v-card v-else class="px-3">
    <v-list>
      <template v-for="(event, i) in allEventData">
        <v-list-item :key="event.eventId">
          <v-row align="center" style="width: 100%;">
            <v-col class="flex-grow-0 text-no-wrap text--secondary">
              {{ event.date }}
            </v-col>
            <v-col class="text-truncate">
              {{ event.name }}
            </v-col>
            <v-col class="flex-grow-0">
              <v-btn
                small
                outlined
                color="primary"
                :to="`/events/edit/${event.eventId}`"
              >
                EDIT
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
            CREATE NEW EVENT
          </v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
import moment from 'moment'

const UsersRepo = RepositoryFactory.get('users')

@Component
export default class YourEvents extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  events: Schemas.Event[] | null = []

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
    this.events = (await UsersRepo.me.events.get()).data
  }

  get allEventData() {
    return this.events.map(event => ({
      eventId: event.eventId,
      name: event.name,
      date: moment(event.timeStart).format('MM/DD'),
    }))
  }
}
</script>
