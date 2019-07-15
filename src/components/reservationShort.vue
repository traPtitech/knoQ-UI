<template>
<v-card>
  <v-card-text  style="font-size: 100%;">
    <v-layout row wrap>
      <v-flex hidden-xs-only sm4 class="font-weight-bold" overflow-hidden>
        <span style="cursor: pointer"
          @click="$router.push({ name: 'ReservationDescription', params: { id: reservation.id } })"
        >
          {{reservation.name}}
        </span>
      </v-flex>
      <v-flex hidden-xs-only sm3 :class="groupColor">
        <span style="cursor: pointer"
          @click="$router.push({ name: 'GroupDescription', params: { id: reservation.group_id } })"
        >
          ◦{{reservation.group.name}}
        </span>
      </v-flex>
      <v-flex hidden-sm-and-up xs5>
          <div style="cursor: pointer;" class="font-weight-bold"
            @click="$router.push({ name: 'ReservationDescription', params: { id: reservation.id } })"
          >
            {{reservation.name}}
          </div>
        <span style="cursor: pointer;
            padding-left: 7px;
            font-size: 75%;"
          :class="groupColor"
          @click="$router.push({ name: 'GroupDescription', params: { id: reservation.group_id } })"
        >
          ◦{{reservation.group.name}}
        </span>
      </v-flex>
      <v-flex sm1 text-xs-right>
        <v-icon small>place</v-icon>{{reservation.room.place}}
      </v-flex>
      <v-flex hidden-xs-only sm2 text-xs-right>
        {{date}}
      </v-flex>
      <v-flex hidden-xs-only sm2 text-xs-right>
        {{reservation.time_start.slice(0,5)}} -{{reservation.time_end.slice(0,5)}}
      </v-flex>
      <v-flex hidden-sm-and-up xs3 text-xs-right>
        <div>
          {{date.slice(0,5)}}
        </div>
        <span style="font-size: 75%;" class="font-weight-bold">{{reservation.time_start.slice(0,5)}} -</span>
      </v-flex>
    </v-layout>
  </v-card-text>
</v-card>
</template>

<script>
import moment from 'moment'
import color from '../tips/color'
export default {
  props: ['reservation'],
  created () {
  },
  computed: {
    groupColor: function () {
      return color.GroupColors(this.reservation.group.id) + '--text'
    },
    date: function () {
      return moment(new Date(this.reservation.date)).format('MM/DD (ddd)')
    }
  }

}
</script>

<style>

</style>
