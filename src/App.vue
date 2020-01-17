<template>
  <v-app>
    <Sidebar ref="sidebar" />
    <NavBar @toggleDrawer="toggleDrawer" />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Sidebar from '@/components/main/Sidebar/Sidebar.vue'
import NavBar from '@/components/main/NavBar/NavBar.vue'
import { RepositoryFactory } from './repositories/RepositoryFactory'

@Component({
  components: {
    Sidebar,
    NavBar,
  },
})
export default class App extends Vue {
  toggleDrawer() {
    ;(this.$refs.sidebar as Sidebar).toggleDrawer()
  }
}
</script>
