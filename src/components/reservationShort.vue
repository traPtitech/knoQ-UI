<template>
<v-card>
  <v-card-text>
    {{reservation.date}}
  </v-card-text>
  <v-card-text>
    <v-layout row wrap>
      <v-flex class="font-weight-bold">
        {{reservation.name}}
      </v-flex>
      <v-flex class="green--text">
        <li>{{reservation.group.name}}</li>
      </v-flex>
      <v-flex>
        <v-icon small>place</v-icon>{{reservation.place}}
      </v-flex>
      <v-flex text-xs-center>
        {{reservation.date}}
      </v-flex>
      <v-flex text-xs-right>
        {{reservation.timeStart}} - {{reservation.timeEnd}}
      </v-flex>
    </v-layout>
  </v-card-text>
</v-card>
</template>

<script>
export default {
  props: ['reservation']
}
</script>
