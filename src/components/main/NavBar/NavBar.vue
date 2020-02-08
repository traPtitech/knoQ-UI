<template>
  <v-app-bar app v-if="$vuetify.breakpoint.smAndDown">
    <v-app-bar-nav-icon @click="onClickNavIcon" />
    <v-toolbar-title class="headline font-weight-bold">
      Room
    </v-toolbar-title>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit } from 'vue-property-decorator'

@Component
export default class NavBar extends Vue {
  @Emit('toggleDrawer')
  onClickNavIcon() {}
}
</script>
