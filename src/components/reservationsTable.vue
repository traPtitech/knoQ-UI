<template>
  <v-container>
    <v-carousel interval="60000" height="1000">
      <v-carousel-item :key="i" v-for="i in Math.floor(reservations.length / 4) + 1">
        <v-container grid-list-md>
          <v-layout row wrap align-center justify-space-around>
            <v-flex xs12 sm6 :key="j" v-for="j in cards">
              <reservationCard :reservation="reservations[(i-1)*4+j-1]"></reservationCard>
            </v-flex>
          </v-layout>
        </v-container>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
import reservationCard from './reservationCard'
export default {
  components: {
    reservationCard
  },
  data () {
    return {}
  },
  methods: {},
  computed: {
    reservations () {
      return this.$store.state.reservations
    },
    cards () {
      return this.reservations.length % 4
    }
  }
}
</script>
