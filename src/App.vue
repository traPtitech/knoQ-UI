<template>
  <v-app>
    <v-snackbar v-model="snackbar" top>
      {{ snackMessage }}
      <v-btn color="pink" flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <Header />
    <v-content>
      <router-view />
    </v-content>
    <v-footer dark height="auto">
      <v-card class="flex" flat tile>
        <v-card-title class="teal justify-center">
          <v-btn
            v-for="link in footerlinks"
            :key="link.head"
            class="mx-3"
            dark
            flat
            small
            @click="openLink(link.src)"
          >
            {{ link.head }}
          </v-btn>
        </v-card-title>

        <v-card-actions class="grey darken-3 font-italic justify-end">
          バージョン 0.1.0
        </v-card-actions>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import Header from '@/components/Organisms/Header'
import { RepositoryFactory } from './repositories/RepositoryFactory'
import { mapActions } from 'vuex'

const RoomsRepository = RepositoryFactory.set('rooms')
export default {
  name: 'App',
  components: {
    Header,
  },
  data() {
    return {
      drawer: false,
      query: '',
      dialog: false,
      footerlinks: [
        {
          head: '使い方',
          src: 'https://md.trapti.tech/0spW8adnSyCUaV_wioVlWA',
        },
        {
          head: '質問・要望・報告',
          src: 'http://anke-to.sysad.trap.show/targeted',
        },
        {
          head: '進捗部屋の追加申告',
          src: 'https://q.trap.jp/channels/general/executive/room',
        },
      ],
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
    openLink: link => window.open(link),
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
