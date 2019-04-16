<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        予約の確認
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <search />
    </v-content>
    <div>
      {{ $store.state.reservations }}
    </div>
  </v-app>
</template>

<script>
import search from './components/search'

export default {
  name: 'App',
  components: {
    search
  },
  data () {
    return {
      //
    }
  }
}
</script>
