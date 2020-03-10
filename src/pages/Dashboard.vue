<template>
  <v-container>
    <DashboardItem>
      <DashboardItemTitle>今日の進捗部屋</DashboardItemTitle>
      <RoomList />
    </DashboardItem>
    <DashboardItem>
      <DashboardItemTitle>今日のイベント</DashboardItemTitle>
      <EventListToday />
    </DashboardItem>
    <v-row>
      <v-col md="6" cols="12">
        <DashboardItem>
          <DashboardItemTitle>あなたのイベント</DashboardItemTitle>
          <YourEvents />
        </DashboardItem>
      </v-col>
      <v-col md="6" cols="12">
        <DashboardItem>
          <DashboardItemTitle>通知</DashboardItemTitle>
          <NotificationList />
        </DashboardItem>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import DashboardItem from '@/components/dashboard/DashboardItem.vue'
import DashboardItemTitle from '@/components/dashboard/DashboardItemTitle.vue'
import EventListToday from '@/components/dashboard/EventListToday.vue'
import RoomList from '@/components/dashboard/RoomList.vue'
import YourEvents from '@/components/dashboard/YourEvents.vue'
import NotificationList from '@/components/dashboard/NotificationList.vue'

@Component({
  components: {
    DashboardItem,
    DashboardItemTitle,
    RoomList,
    EventListToday,
    YourEvents,
    NotificationList,
  },
})
export default class Dashboard extends Vue {}
</script>
