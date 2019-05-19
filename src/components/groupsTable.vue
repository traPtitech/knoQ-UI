<template>
  <v-data-table
    :headers="$store.state.groupHeaders"
    :items="groups"
    class="elevation-1"
  >
    <template v-slot:items="props">
      <td>{{ props.item.id }}</td>
      <td class="text-xs-center">{{ props.item.name }}</td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: ['groups']
}
</script>
