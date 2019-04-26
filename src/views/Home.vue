<template>
    <v-container grid-list-xl>
      <v-layout>
        <v-flex>
          <search />
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex lg9>
          <h1>予約情報
            <v-btn icon large>
             <v-icon>add</v-icon>
           </v-btn>
          </h1>
         <reservationTable />
        </v-flex>
        <v-flex lg3>
          <h1>グループ情報
            <v-btn icon large>
             <v-icon>add</v-icon>
           </v-btn>
          </h1>
         <groupTable />
        </v-flex>
      </v-layout>
      </v-container>
</template>

<script>
import search from '../components/search'
import reservationTable from '../components/reservationsTable'
import groupTable from '../components/groupsTable'

export default {
  components: {
    search,
    reservationTable,
    groupTable
  }
}
</script>
