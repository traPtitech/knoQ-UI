<template>
  <v-card>
    <v-card-text style="font-size: 100%;">
      <v-layout 
        row 
        wrap
      >
        <v-flex 
          xs5 
          sm7
          class="font-weight-bold" 
        >
          <v-layout
            wrap
          >
            <v-flex
              xs12
              sm7
              style="cursor: pointer"
              @click="$router.push({ name: 'ReservationDescription', params: { id: reservation.id } })"
            >
              {{ reservation.name }}
            </v-flex>
            <v-flex
              :class="groupColor"
              xs12
              sm5
            >
              <span 
                style="cursor: pointer"
                @click="$router.push({ name: 'GroupDescription', params: { id: reservation.group_id } })"
              >
                ◦{{ reservation.group.name }}
              </span>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex
          xs7
          sm5
        >
          <v-layout
            wrap
            text-xs-left
          >
            <v-flex 
              xs6
              sm4
              style="cursor: pointer;" 
              @click="openClassinfo(reservation.room.place)"
            >
              <v-icon small>place</v-icon>{{ reservation.room.place }}
            </v-flex>

            <v-flex 
              xs6
              sm4
            >
              {{ date }}
            </v-flex>
            <v-flex 
              xs12
              sm4
              class="font-weight-bold"
            >
              {{ reservation.time_start.slice(0,5) }} - {{ reservation.time_end.slice(0,5) }}
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from 'moment'
import color from '@/tips/color'
import TokyoTech from '@/tips/TokyoTech'
export default {
  props: {
    reservation: {
      type: Object,
      default: function(){
        return {}
      }
    }
  },
  computed: {
    groupColor: function () {
      return color.GroupColors(this.reservation.group.id) + '--text'
    },
    date: function () {
      return moment(new Date(this.reservation.date)).format('MM/DD (ddd)')
    }
  },
  created () {
  },
  methods: {
    openClassinfo: place => {
      const classLink = TokyoTech.searchRoom(place)
      window.open(classLink)
    }
  },

}
</script>

<style>

</style>
