<template>
  <v-card class="px-3">
    <v-list>
      <template v-for="(notification, i) in notifications">
        <v-list-item :key="notification.id">
          <v-row align="center" style="width: 100%;">
            <v-col class="flex-grow-0 text-no-wrap text--secondary">
              {{ notification.date }}
            </v-col>
            <v-col class="text-truncate">
              {{ notification.content }}
            </v-col>
          </v-row>
        </v-list-item>
        <v-divider v-if="i + 1 < notifications.length" :key="-i" />
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class NotificationList extends Vue {
  get notifications() {
    return [
      {
        id: 9,
        date: '12/31',
        content: 'Event created: React workshop (SysAd)',
      },
      {
        id: 4,
        date: '01/01',
        content: 'Event edited: Vue workshop (SysAd)',
      },
      {
        id: 1,
        date: '01/03',
        content: 'Event canceled: Angular workshop (SysAd)',
      },
    ]
  }
}
</script>
