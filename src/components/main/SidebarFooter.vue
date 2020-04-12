<template>
  <v-row class="mx-4 mb-5" justify="space-between" align="center" dense>
    <v-col>Room {{ version }}</v-col>
    <v-col class="flex-grow-0">
      <v-btn
        v-if="isAdmin"
        icon
        title="Sync rooms with GoogleCalender"
        @click="syncRooms"
      >
        <v-icon>mdi-cached</v-icon>
      </v-btn>
    </v-col>
    <v-col class="flex-grow-0">
      <v-btn
        icon
        title="help"
        href="https://md.trapti.tech/0spW8adnSyCUaV_wioVlWA"
        target="_blank"
      >
        <v-icon>mdi-help</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import RepositoryFactory from '@/repositories/RepositoryFactory'

const RoomsRepo = RepositoryFactory.get('rooms')

@Component
export default class SidebarFooter extends Vue {
  get version(): string {
    return process.env.__APP_VERSION__
  }

  get isAdmin(): boolean | undefined {
    return this.$store.direct.state.me?.admin
  }

  async syncRooms() {
    try {
      await RoomsRepo.all.post()
      window.location.reload()
    } catch (__) {
      alert('Failed to sync rooms...')
    }
  }
}
</script>
