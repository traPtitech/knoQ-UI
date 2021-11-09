<template>
  <v-container>
    <dashboard-item>
      <dashboard-item-title>今日の進捗部屋</dashboard-item-title>
      <room-list />
    </dashboard-item>
    <dashboard-item>
      <dashboard-item-title>今日のイベント</dashboard-item-title>
      <event-list-today />
    </dashboard-item>
    <v-row>
      <v-col md="6" cols="12">
        <dashboard-item>
          <dashboard-item-title>あなたのイベント</dashboard-item-title>
          <your-events />
        </dashboard-item>
      </v-col>
      <v-col md="6" cols="12">
        <dashboard-item>
          <dashboard-item-title>あなたのグループ</dashboard-item-title>
          <your-groups />
        </dashboard-item>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import DashboardItem from '@/components/dashboard/DashboardItem.vue'
import DashboardItemTitle from '@/components/dashboard/DashboardItemTitle.vue'
import EventListToday from '@/components/event/EventListToday.vue'
import RoomList from '@/components/dashboard/RoomList.vue'
import YourEvents from '@/components/dashboard/YourEvents.vue'
import YourGroups from '@/components/dashboard/YourGroups.vue'

@Component({
  components: {
    DashboardItem,
    DashboardItemTitle,
    RoomList,
    EventListToday,
    YourEvents,
    YourGroups,
  },
})
export default class Dashboard extends Vue {}
</script>
