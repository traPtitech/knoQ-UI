<template>
  <v-container grid-list-xl>
    <v-layout>
      <v-flex>
        <search />
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex>
        <h1>予約情報
          <v-btn icon large @click="$router.push({ name: 'ReservationNew' })">
           <v-icon>add</v-icon>
         </v-btn>
        </h1>
       <reservationTable />
      </v-flex>
      <v-flex>
        <h1>グループ情報
          <v-btn icon large @click="$router.push({ name: 'GroupNew' })">
           <v-icon>add</v-icon>
         </v-btn>
        </h1>
       <groupTable />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import search from '../components/search'
import reservationTable from '../components/reservationsTable'
import groupTable from '../components/groupsTable'
import { mapActions } from 'vuex'

export default {
  components: {
    search,
    reservationTable,
    groupTable
  },
  created: async function () {
    await this.getUserMe()
    this.getGroups(this.$store.state.loginUser.traq_id)
    this.getReservations({ traQID: this.$store.state.loginUser.traq_id })
  },
  methods: {
    ...mapActions(['getUserMe', 'getGroups', 'getReservations'])
  }
}
</script>
