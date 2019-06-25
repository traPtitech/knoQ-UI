<template>
  <v-data-table
    :headers="$store.state.groupHeaders"
    :items="groups"
    class="elevation-1"
  >
    <template v-slot:items="props">
      <td :class="groupColor(props.item.id)">
        <span
          @click="$router.push({ name: 'GroupDescription', params: { id: props.item.id } })"
          style="cursor: pointer;"
        >
          ◦{{ props.item.name }}
        </span>
      </td>
      <td class="text-xs-left">{{ props.item.members.length }}</td>
    </template>
  </v-data-table>
</template>

<script>
import color from '../tips/color'
export default {
  props: ['groups'],
  methods: {
    groupColor (groupID) {
      return color.GroupColors(groupID) + '--text'
    }
  }
}
</script>
