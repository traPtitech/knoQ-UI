<template>
  <v-data-table
    :headers="$store.state.revHeaders"
    :items="$store.state.reservations"
    class="elevation-1"
  >
    <template v-slot:items="props">
      <td>{{ props.item.id }}</td>
      <td class="text-xs-right">{{ props.item.group_id }}</td>
      <td class="text-xs-right">{{ props.item.room_id }}</td>
      <td class="text-xs-right">{{ props.item.date }}</td>
      <td class="text-xs-right">{{ props.item.time_start }}</td>
      <td class="text-xs-right">{{ props.item.time_end }}</td>
    </template>
  </v-data-table>
</template>
