<template>
  <v-app :style="{ background }">
    <Sidebar v-model="drawer" />
    <NavigationBar @click-nav-icon="drawer = !drawer" />
    <MainView />
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
