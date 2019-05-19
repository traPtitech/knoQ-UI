<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title @click="$router.push({ name: 'Home' })">
        <span>部屋管理</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="$router.push({ name: 'Rooms' })">rooms</v-btn>
      <v-btn @click="$router.push({ name: 'Reservations' })">reservations</v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      //
    }
  }
}
</script>
