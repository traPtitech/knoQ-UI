<template>
  <v-container fluid grid-list-xl>
    <v-layout column>
      <v-flex>
        <h1>今日の進捗部屋</h1>
        <roomsExpansion :rooms=todayRooms></roomsExpansion>
      </v-flex>
      <v-flex>
        <h1>
          あなたの予約
          <v-btn icon large @click="$router.push({ name: 'ReservationNew' })">
            <v-icon>add</v-icon>
          </v-btn>
        </h1>
        <reservationCardShorts :reservations="$store.state.myReservations"></reservationCardShorts>
      </v-flex>
      <v-flex>
        <h1>
          あなたのグループ
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
import roomsExpansion from '../components/roomsExpansion'
import reservationsCarousel from '../components/reservationsCarousel'
import reservationCardShorts from '../components/reservationCardShorts'
import groupsTable from '../components/groupsTable'
import { RepositoryFactory } from '../repositories/RepositoryFactory'
import { mapActions } from 'vuex'
import moment from 'moment'
const RoomsRepository = RepositoryFactory.set('rooms')

export default {
  components: {
    roomsExpansion,
    reservationsCarousel,
    groupsTable,
    reservationCardShorts
  },
  data () {
    return {
      todayRooms: []
    }
  },
  created: async function () {
    await this.getUserMe()
    const today = moment(new Date()).format('YYYY-MM-DD')

    const { data } = await RoomsRepository.get(
      {
        dateBegin: today,
        dateEnd: today
      }
    )
    this.todayRooms = data
    console.log(data)
    this.getMyGroups()
    this.getMyReservations()
  },
  methods: {
    ...mapActions(['getUserMe', 'getMyGroups', 'getMyReservations'])
  }
}
</script>
