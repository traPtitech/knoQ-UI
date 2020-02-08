<template>
  <v-row class="mx-2 mb-3" justify="space-between" align="center">
    <v-col> Room {{ version }} </v-col>
    <v-col class="flex-grow-0">
      <v-btn icon title="help" :href="helpPageURL">
        <v-icon> mdi-help </v-icon>
      </v-btn>
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

  get helpPageURL() {
    return helpPageURL
  }
}

const helpPageURL = 'https://md.trapti.tech/0spW8adnSyCUaV_wioVlWA'
</script>
