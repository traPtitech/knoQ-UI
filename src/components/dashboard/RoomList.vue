<template>
  <v-row>
    <v-col v-for="(room, i) in rooms" :key="i" sm="4" cols="12">
      <RoomListItem v-bind="room" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import RoomListItem from '@/components/dashboard/RoomListItem.vue'

@Component({
  components: {
    RoomListItem,
  },
})
export default class RoomList extends Vue {
  rooms = [
    {
      place: 'S512',
      timeStart: '9:00 am',
      timeEnd: '8:00 pm',
    },
    {
      place: 'S514',
      timeStart: '4:00 pm',
      timeEnd: '8:00 pm',
    },
    {
      place: 'H101',
      timeStart: '5:00 pm',
      timeEnd: '8:00 pm',
    },
  ]
}
</script>
