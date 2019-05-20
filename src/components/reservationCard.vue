<template>
  <v-card color="blue-grey darken-2" class="title white--text" height="350" min-width="220"
    @click="$router.push({ name: 'ReservationDescription', params: { id: reservation.id } })"
    hover
  >
    <v-card-title primary-title>
      <v-container>
        <v-layout>
          <v-flex xs7>
            <div class="headline">{{ reservation.name }}</div>
          </v-flex>
          <v-flex>
            <div
              class="headline text-xs-right info--text"
            ><v-icon color="white">calendar_today</v-icon> {{ reservation.date.getMonth() + 1 }}/{{ reservation.date.getDate() }}</div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-title>
    <v-card-text>
      <v-container fluid grid-list-xl>
        <v-layout
          @click="$router.push({ name: 'GroupDescription', params: { id: reservation.group_id } })"
          class="test"
        >
          <v-flex>
            <div class="text-xs-left"><v-icon color="white">people</v-icon> {{ reservation.group.name }}</div>
          </v-flex>
          <v-flex>
            <div class="text-xs-right">{{ reservation.group.members.length }}人</div>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <div><v-icon color="white">place</v-icon> {{ reservation.room.place }}</div>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <div>
              <v-icon color="white">watch_later</v-icon> {{ reservation.time_start.slice(0,5) }} ~ {{ reservation.time_end.slice(0,5) }}
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['reservation']
}
</script>

<style>
  .test:hover{
    color: orange;
  }
</style>
