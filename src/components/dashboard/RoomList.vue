<template>
  <div v-if="status === 'loading'" class="text--secondary">
    読み込み中...
  </div>
  <div v-else-if="status === 'error'" class="text--secondary">
    読み込めませんでした...
  </div>
  <div v-else-if="!rooms.length" class="text--secondary">
    今日の進捗部屋はありません
  </div>
  <v-row v-else>
    <v-col v-for="(room, i) in rooms" :key="i" sm="4" cols="12">
      <RoomListItem v-bind="room" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import RoomListItem from '@/components/dashboard/RoomListItem.vue'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import { today } from '@/workers/date'

const RoomsRepo = RepositoryFactory.get('rooms')

@Component({
  components: {
    RoomListItem,
  },
})
export default class RoomList extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  rooms: Schemas.Room[] | null = null

  async created() {
    this.status = 'loading'
    try {
      await this.fetchRooms()
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }
  async fetchRooms() {
    this.rooms = (
      await RoomsRepo.get({ dateBegin: today(), dateEnd: today() })
    ).data.filter(room => room.public)
  }
}
</script>
