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
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import search from './components/search'

export default {
  name: 'App',
  components: {
    HelloWorld,
    search
  },
  data () {
    return {
      //
    }
  }
}
</script>
