<template>
  <v-app :style="{ background }">
    <sidebar v-model="drawer" />
    <navigation-bar @click-nav-icon="drawer = !drawer" />
    <main-view />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Sidebar from '@/components/main/Sidebar.vue'
import NavigationBar from '@/components/main/NavigationBar.vue'
import MainView from '@/components/main/MainView.vue'

@Component({
  components: {
    Sidebar,
    NavigationBar,
    MainView,
  },
})
export default class App extends Vue {
  drawer: boolean | null = null

  get background() {
    return this.$vuetify.theme.themes.light.background
  }
}
</script>
