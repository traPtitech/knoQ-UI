<template>
  <v-app :style="{ background }">
    <Sidebar v-model="drawer" />
    <NavBar @click-nav-icon="drawer = !drawer" />
    <MainView />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Sidebar from '@/components/main/Sidebar/Sidebar.vue'
import NavBar from '@/components/main/NavBar/NavBar.vue'
import MainView from '@/components/main/MainView.vue'
import { RepositoryFactory } from './repositories/RepositoryFactory'

@Component({
  components: {
    Sidebar,
    NavBar,
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
