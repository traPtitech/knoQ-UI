<template>
<v-container fluid>
  <v-layout row wrap>
    <v-flex xs12 xl6 :key="i" v-for="i in reservations.length">
      <reservationShort :reservation="reservations[i-1]"></reservationShort>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import reservationShort from '../components/reservationShort'
export default {
  props: ['reservations'],
  components: {
    reservationShort
  }
}
</script>
