<template>
  <v-row justify="space-around">
    <span>Room {{ version }}</span>
    <v-icon @click="openHelpPage">mdi-help</v-icon>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Footer extends Vue {
  version = 'ver0.0.1'

  openHelpPage() {
    window.open(helpPageURL)
  }
}

const helpPageURL = 'https://md.trapti.tech/0spW8adnSyCUaV_wioVlWA'
</script>
