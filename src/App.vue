<template>
  <v-app>
    <v-snackbar
      v-model="snackbar"
      top
    >
      {{ snackMessage }}
      <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-toolbar app>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title style="cursor: pointer" @click="$router.push({ name: 'Home' })">
        <span>部屋管理</span>
      </v-toolbar-title>
      <!--
      <v-flex hidden-xs-only text-xs-right>
        <v-btn @click="$router.push({ name: 'Rooms' })">rooms</v-btn>
        <v-btn @click="$router.push({ name: 'Reservations' })">reservations</v-btn>
        <v-btn @click="$router.push({ name: 'Groups' })">groups</v-btn>
      </v-flex>
      -->
      <v-spacer></v-spacer>
      <v-flex xs6 hidden-xs-only>
        <v-text-field
          v-model="query"
          @keydown.enter="trigger"
          label="フリーワード検索"
          prepend-icon="search"
          single-line
          color="red"
          background-color="pink lighten-5"
          clearable
       >
       </v-text-field>
      </v-flex>

      <v-spacer></v-spacer>
      <v-flex hidden-sm-and-up text-xs-right>
      <v-dialog
        v-model="dialog"
        full-width
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            flat
            icon
          >
          <v-icon>search</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
        <v-text-field
          v-model="query"
          @keydown.enter="trigger"
          label="フリーワード検索"
          prepend-icon="search"
          single-line
          color="red"
          background-color="pink lighten-5"
          clearable
       >
       </v-text-field>
            <v-btn
              color="primary"
              flat
              icon
              @click="dialog = false; search();"
            >
              <v-icon>search</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-dialog>
      </v-flex>

        <v-avatar
          :size="32"
        >
          <img :src="'https://q.trapti.tech/static/icon/' + traQID + '/64.png'" alt="avatar">
        </v-avatar>
    </v-toolbar>
    <v-navigation-drawer
        v-model="drawer"
        temporary
        app
      >
        <v-list class="pa-1">
          <v-list-tile @click="$router.push({ name: 'Home' })">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-list class="pt-0" dense>
          <v-divider></v-divider>
          <v-list-tile @click="$router.push({ name: 'Rooms' })">
            <v-list-tile-action>
              <v-icon>meeting_room</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Rooms</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="$router.push({ name: 'Reservations' })">
            <v-list-tile-action>
              <v-icon>bookmarks</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Reservations</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="$router.push({ name: 'Groups' })">
            <v-list-tile-action>
              <v-icon>group</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Groups</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile v-if="this.$store.state.loginUser.Admin" @click="roomsAll()">
            <v-list-tile-action>
              <v-icon>add</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>ADD ROOMS</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>

    <v-content>
      <router-view/>
    </v-content>

    <v-footer
      dark
      height="auto"
    >
      <v-card
        class="flex"
        flat
        tile
      >
        <v-card-title class="teal justify-center">
          <v-btn
            v-for="(link) in footerlinks"
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
import { RepositoryFactory } from './repositories/RepositoryFactory'
import { mapActions } from 'vuex'
const RoomsRepository = RepositoryFactory.set('rooms')
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      drawer: false,
      query: '',
      dialog: false,
      footerlinks: [
        { head: '使い方', src: 'https://md.trapti.tech/0spW8adnSyCUaV_wioVlWA' },
        { head: '質問・要望・報告', src: 'http://anke-to.sysad.trap.show/targeted' },
        { head: '進捗部屋の追加申告', src: 'https://q.trap.jp/channels/general/executive/room' }
      ],
      snackbar: false,
      snackMessage: ''
    }
  },
  created: async function () {
    await this.getUserMe()
  },
  methods: {
    roomsAll: async function () {
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
    trigger: function (event) {
      if (event.keyCode === 13) {
        this.search()
      }
    },
    search: function () {
      if (this.query !== '') {
        this.dialog = false
        this.$router.push({ name: 'Search', query: { q: this.query } })
      }
    },
    openLink: link => window.open(link),
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

<style>
.v-dialog {
    position: absolute;
    top: 0;
    padding-right: 50px;
}
</style>
