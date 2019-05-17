<template>
  <v-container>
    <v-carousel interval="60000" height="1000">
      <v-carousel-item :key="i" v-for="i in numCarousel">
        <v-container grid-list-right>
          <v-layout row wrap align-center justify-space-around>
            <v-flex xs12 sm8 md6 :key="j" v-for="j in numCards(i)">
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
    return {
    }
  },
  methods: {},
  computed: {
    reservations () {
      return this.$store.state.myReservations
    },
    numCarousel () {
      return Math.ceil(this.reservations.length / 4)
    },
    numCards () {
      return function (i) {
        if ((this.reservations.length - (i - 1) * 4) / 4 >= 1) {
          return 4
        } else {
          return this.reservations.length - (i - 1) * 4
        }
      }
    }
  }
}
</script>
