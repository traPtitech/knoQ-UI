<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    :mobile-break-point="$vuetify.breakpoint.thresholds.sm"
  >
    <Header />

    <v-list nav>
      <NavLink v-for="nav in navs" :key="nav.title" v-bind="nav" />
    </v-list>

    <template v-slot:append>
      <Footer />
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Header from '@/components/Main/Sidebar/Header.vue'
import NavLink from '@/components/Main/Sidebar/NavLink.vue'
import Footer from '@/components/Main/Sidebar/Footer.vue'

@Component({
  components: {
    Header,
    NavLink,
    Footer,
  },
})
export default class Sidebar extends Vue {
  drawer: boolean | null = null

  navs = _navs

  toggleDrawer(): void {
    this.drawer = !this.drawer
  }
}

const _navs = [
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
  {
    icon: 'mdi-account-group',
    title: 'Groups',
    link: '/groups',
  },
]
</script>
