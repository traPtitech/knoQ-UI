<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    :mobile-break-point="$vuetify.breakpoint.thresholds.sm"
  >
    <template v-slot:prepend>
      <Header />
    </template>

    <v-list rounded>
      <NavLink v-for="(nav, i) in navs" :key="i" v-bind="nav" />
    </v-list>

    <template v-slot:append>
      <Footer />
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Header from '@/components/main/Sidebar/Header.vue'
import NavLink from '@/components/main/Sidebar/NavLink.vue'
import Footer from '@/components/main/Sidebar/Footer.vue'

@Component({
  components: {
    Header,
    NavLink,
    Footer,
  },
})
export default class Sidebar extends Vue {
  drawer: boolean | null = null

  get navs() {
    return navs
  }

  toggleDrawer() {
    this.drawer = !this.drawer
  }
}

const navs = [
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
