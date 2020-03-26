<template>
  <v-container>
    <v-card class="pa-9">
      <div class="mb-7">
        <h1 class="display-1 d-inline mr-5">{{ name }}</h1>
        <v-btn
          v-if="!joining"
          small
          depressed
          color="primary"
          class="mb-3"
          @click="joining = true"
        >
          JOIN
        </v-btn>
        <v-btn
          v-else
          small
          outlined
          color="primary"
          class="mb-3"
          @click="joining = false"
        >
          JOINING
        </v-btn>
      </div>
      <MarkdownField :src="description" class="mb-7" />
      <div class="mb-7">
        <div class="text--secondary">Members</div>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header class="pa-0">
              <span class="headline"> {{ members.length }} members </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <TrapAvatar
                v-for="member in members"
                :key="member"
                size="36"
                :traq-id="member"
                class="mr-3 mb-2"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div>
        <div class="text--secondary">Events</div>
        <EventList :events="events" />
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import EventList from '@/components/event/EventList.vue'
import TrapAvatar from '@/components/shared/TrapAvatar.vue'

@Component({
  components: {
    MarkdownField,
    EventList,
    TrapAvatar,
  },
})
export default class Detail extends Vue {
  joining = false
  name = 'Room.dev'
  description = '# Hello, vue developer'
  members = ['fuji', 'you10', 'wasabi']
  events = [
    {
      id: 1,
      date: '2019-12-31',
      timeStart: '3:00 pm',
      timeEnd: '8:00 pm',
      place: 'place1',
      title: 'event1',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      tags: ['react', 'haskell', 'purescript'],
    },
    {
      id: 2,
      date: '2019-12-31',
      timeStart: '5:00 pm',
      timeEnd: '8:00 pm',
      place: 'place2',
      title: 'event2',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      tags: ['react', 'vue', 'angular'],
    },
    {
      id: 4,
      date: '2020-12-31',
      timeStart: '5:00 pm',
      timeEnd: '8:00 pm',
      place: 'place3',
      title: 'event3',
      description: 'ハローキティ！できたてのポップコーンはいかが？'.repeat(10),
      tags: ['react', 'haskell', 'purescript'],
    },
  ]
}
</script>

<style>
/* Remove shadow of expansion panel */
.v-expansion-panel::before {
  content: none;
}
</style>
