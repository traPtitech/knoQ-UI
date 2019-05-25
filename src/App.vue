<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title style="cursor: pointer" @click="$router.push({ name: 'Home' })">
        <span>部屋管理</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="$router.push({ name: 'Rooms' })">rooms</v-btn>
      <v-btn @click="$router.push({ name: 'Reservations' })">reservations</v-btn>
      <v-btn @click="$router.push({ name: 'Groups' })">groups</v-btn>
      <v-avatar
        :size="32"
      >
        <img :src="'https://q.trapti.tech/static/icon/' + traQID + '/64.png'" alt="avatar">
      </v-avatar>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      //
    }
  },
  created: async function () {
    await this.getUserMe()
  },
  methods: {
    ...mapActions(['getUserMe'])
  },
  computed: {
    traQID () {
      if (!this.$store.state.loginUser.traq_id) {
        return 'fuji'
      }
      return this.$store.state.loginUser.traq_id
    }
  }
}
</script>
