<template>
  <v-app>
    <v-snackbar v-model="snackbar" top>
      {{ snackMessage }}
      <v-btn color="pink" flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <Sidebar />
    <Header />
    <v-content>
      <router-view />
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import Header from '@/components/Organisms/Header'
import Footer from '@/components/Organisms/Footer'
import Sidebar from '@/components/Main/Sidebar/Sidebar'
import { RepositoryFactory } from './repositories/RepositoryFactory'
import { mapActions } from 'vuex'

const RoomsRepository = RepositoryFactory.get('rooms')
export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Sidebar,
  },
  data() {
    return {
      drawer: false,
      query: '',
      dialog: false,
      snackbar: false,
      snackMessage: '',
    }
  },
  computed: {
    traQID() {
      if (!this.$store.state.loginUser.traq_id) {
        return 'fuji'
      }
      return this.$store.state.loginUser.traq_id
    },
  },
  created: async function() {
    await this.getUserMe()
  },
  methods: {
    roomsAll: async function() {
      try {
        const response = await RoomsRepository.postAll()
        console.log(response)
        this.snackMessage = response.statusText
        this.snackbar = true
      } catch (error) {
        this.snackMessage = error
        this.snackbar = true
      }
    },
    trigger: function(event) {
      if (event.keyCode === 13) {
        this.search()
      }
    },
    search: function() {
      if (this.query !== '') {
        this.dialog = false
        this.$router.push({ name: 'Search', query: { q: this.query } })
      }
    },
    ...mapActions(['getUserMe']),
  },
}
</script>

<style>
.v-dialog {
  position: absolute;
  top: 0;
  padding-right: 50px;
}
</style>
