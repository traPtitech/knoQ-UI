<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      v-for="i in reservations.length"
      :key="i"
      xs12
      xl6
    >
      <reservationShort :reservation="reservations[i-1]"/>
    </v-flex>
  </v-layout>
</template>

<script>
import reservationShort from '@/components/reservation/short-card'
export default {
  components: {
    reservationShort
  },
  props: {
    reservations: {
      type: Array,
      default: function(){
        return []
      }
    }
  }
}
</script>
