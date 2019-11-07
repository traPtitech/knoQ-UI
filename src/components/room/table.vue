<template>
  <v-data-table
    :headers="$store.state.roomHeaders"
    :items="rooms"
    class="elevation-1"
  >
    <template v-slot:items="props">
      <td class="text-xs-left">{{ props.item.date }}</td>
      <td class="text-xs-left">{{ props.item.place }}</td>
      <td class="text-xs-left">{{ props.item.time_start }}</td>
      <td class="text-xs-left">{{ props.item.time_end }}</td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    rooms: {
      type: Array,
      default: function() {
        return []
      },
    },
  },
}
</script>
