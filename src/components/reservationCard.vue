<template>
  <v-card color="blue-grey darken-2" class="title">
    <v-card-title primary-title>
      <v-container>
        <v-layout>
          <v-flex xs12>
            <div class="headline">{{ reservation.name }}</div>
          </v-flex>
          <v-flex>
            <div
              class="headline text-md-right info--text"
            >{{ reservation.date.getMonth() + 1 }}/{{ reservation.date.getDate() }}</div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-layout>
          <v-flex>
            <div>グループ：{{ reservation.group.name }}</div>
          </v-flex>
          <v-flex>
            <div class="text-xs-right">{{ reservation.group.members.length }}人</div>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <div>{{ reservation.room.place }}</div>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <div>
              {{ reservation.time_start.slice(0,5) }} ~ {{ reservation.time_end.slice(0,5) }}
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn flat color="orange"></v-btn>
      <v-btn flat color="orange"></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['reservation']
}
</script>
