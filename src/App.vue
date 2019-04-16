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

      <Table />
  </v-app>
</template>

<script>
import search from './components/search'
import Table from './components/reservationsTable'

export default {
  name: 'App',
  components: {
    search,
    Table
  },
  data () {
    return {
      //
    }
  }
}
</script>
