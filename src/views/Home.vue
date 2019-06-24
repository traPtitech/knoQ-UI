<template>
  <v-container fluid grid-list-xl>
    <v-layout column>
      <v-flex>
        <h1>
          予約情報
          <v-btn icon large @click="$router.push({ name: 'ReservationNew' })">
            <v-icon>add</v-icon>
          </v-btn>
        </h1>
        <reservationCardShorts :reservations="$store.state.myReservations"></reservationCardShorts>
      </v-flex>
      <v-flex>
        <h1>
          グループ情報
          <v-btn icon large @click="$router.push({ name: 'GroupNew' })">
            <v-icon>add</v-icon>
          </v-btn>
        </h1>
        <groupsTable :groups="$store.state.myGroups"></groupsTable>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import search from '../components/search'
import reservationsCarousel from '../components/reservationsCarousel'
import reservationCardShorts from '../components/reservationCardShorts'
import groupsTable from '../components/groupsTable'
import { mapActions } from 'vuex'

export default {
  components: {
    search,
    reservationsCarousel,
    groupsTable,
    reservationCardShorts
  },
  created: async function () {
    await this.getUserMe()
    this.getMyGroups()
    this.getMyReservations()
  },
  methods: {
    ...mapActions(['getUserMe', 'getMyGroups', 'getMyReservations'])
  }
}
</script>
