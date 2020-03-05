<template>
  <v-list rounded>
    <v-list-item
      v-for="nav in navs"
      :key="nav.title"
      color="primary"
      :to="nav.link"
    >
      <v-list-item-icon>
        <v-icon>{{ nav.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ nav.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Navigation extends Vue {
  get navs() {
    return [
      {
        icon: 'mdi-view-dashboard',
        title: 'Dashboard',
        link: '/',
      },
      {
        icon: 'mdi-calendar',
        title: 'Events',
        link: '/events',
      },
      {
        icon: 'mdi-map-marker',
        title: 'Rooms',
        link: '/rooms',
      },
    ]
  }
}
</script>
