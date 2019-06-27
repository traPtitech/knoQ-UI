<template>
<div>
  <div v-if="rooms.length > 1" class="d-flex justify-between align-center mb-3">
    <v-btn @click="all">all</v-btn>
    <v-btn @click="none">none</v-btn>
  </div>

  <v-expansion-panel
    v-model="panel"
    expand
  >
    <v-expansion-panel-content
      v-for="room in rooms"
      :key="room.id"
    >
      <template v-slot:header>
        <v-layout>
          <v-flex sm4 hidden-xs-only text-xs-left>
            {{date(room)}}
          </v-flex>
          <v-flex xs3>
            {{date(room).slice(5,16)}}
          </v-flex>
          <v-flex xs6 sm4 text-xs-left>
            {{room.time_start.slice(0,5)}} - {{room.time_end.slice(0,5)}}
          </v-flex>
          <v-flex xs3 sm4 text-xs-center>
            <v-icon small>place</v-icon>{{room.place}}
          </v-flex>
        </v-layout>
      </template>
      <v-container v-show="!loading">
        <v-layout row wrap>
          <v-flex xs12 v-for="reservation in room.reservations" :key="reservation.id">
            <ReservationShort :reservation="reservation"></ReservationShort>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container v-show="loading">
        ろーど中
        <v-progress-circular :indeterminate="true" :value="0" size="24" class="ml-2"></v-progress-circular>
      </v-container>
    </v-expansion-panel-content>
  </v-expansion-panel>
</div>
</template>

<script>
import moment from 'moment'
import ReservationShort from '../components/reservationShort'
import { RepositoryFactory } from '../repositories/RepositoryFactory'
const ReservationsRepository = RepositoryFactory.set('reservations')

export default {
  components: {
    ReservationShort
  },
  props: ['rooms'],
  data () {
    return {
      panel: [],
      loading: false
    }
  },
  methods: {
    // Create an array the length of our items
    // with all values as true
    all () {
      this.panel = [...Array(this.rooms.length).keys()].map(_ => true)
      // console.log(this.panel)
    },
    // Reset the panel
    none () {
      this.panel = [...Array(this.rooms.length).keys()].map(_ => false)
    }
  },
  computed: {
    date: function () {
      return function (room) {
        return moment(new Date(room.date)).format('YYYY/MM/DD (ddd)')
      }
    }
  },
  watch: {
    panel: async function () {
      console.log(this.panel)
      for (var i = 0; i < this.panel.length; i++) {
        if (this.panel[i] && typeof this.rooms[i].reservations === 'undefined') {
          this.loading = true
          this.rooms[i].reservations = []
          const reservation = { roomID: this.rooms[i].id }
          try {
            const response = await ReservationsRepository.get(reservation)
            console.log(response)
            this.rooms[i].reservations = response.data
            this.loading = false
          } catch (error) {
            console.log(error)
          }
        }
      }
    }
  }
}
</script>
