<template>
  <v-row class="mx-2 mb-3" align="center">
    <v-col cols="9">
      <span class="body">Room {{ version }}</span>
    </v-col>
    <v-col cols="3">
      <v-icon class="body" @click="openHelpPage">mdi-help</v-icon>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Footer extends Vue {
  get version(): string {
    return process.env.__APP_VERSION__
  }

  openHelpPage() {
    window.open(helpPageURL)
  }
}

const helpPageURL = 'https://md.trapti.tech/0spW8adnSyCUaV_wioVlWA'
</script>
