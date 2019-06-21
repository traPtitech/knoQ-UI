<template>
<v-card>
  <v-card-text>
    <v-layout row wrap>
      <v-flex xs4 class="font-weight-bold">
        {{reservation.name}}
      </v-flex>
      <v-flex xs2.5 :class="groupColor">
        <li>{{reservation.group.name}}</li>
      </v-flex>
      <v-flex xs1.5>
        <v-icon small>place</v-icon>{{reservation.room.place}}
      </v-flex>
      <v-flex xs1 text-xs-center>
        {{date}}
      </v-flex>
      <v-flex xs3 text-xs-right>
        {{reservation.time_start.slice(0,5)}} - {{reservation.time_end.slice(0,5)}}
      </v-flex>
    </v-layout>
  </v-card-text>
</v-card>
</template>

<script>
import moment from 'moment'
export default {
  props: ['reservation'],
  computed: {
    groupColor: function () {
      const colors = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue',
        'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime',
        'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'blue-grey'
      ]
      return colors[this.reservation.group.id % colors.length] + '--text'
    },
    date: function () {
      return moment(new Date(this.reservation.date)).format('MM/DD')
    }
  }
}
</script>
