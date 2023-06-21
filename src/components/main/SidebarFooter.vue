<template>
  <v-row class="mx-4 mb-5" justify="space-between" align="center" dense>
    <v-col>knoQ {{ version }}</v-col>
    <v-col class="flex-grow-0">
      <v-btn
        icon
        title="help"
        href="https://wiki.trap.jp/SysAd/docs/knoQ"
        target="_blank"
        rel="noopener noreferer"
      >
        <v-icon>mdi-help</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class SidebarFooter extends Vue {
  get version(): string {
    return import.meta.env.VITE_APP_VERSION
  }
}
</script>
