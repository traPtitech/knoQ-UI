<template>
  <v-data-table
    :headers="$store.state.groupHeaders"
    :items="groups"
    class="elevation-1"
  >
    <template v-slot:items="props">
      <td :class="groupColor(props.item.id)">
        <span
          style="cursor: pointer;"
          @click="$router.push({ name: 'GroupDescription', params: { id: props.item.id } })"
        >
          ◦{{ props.item.name }}
        </span>
      </td>
      <td class="text-xs-left">{{ props.item.members.length }}</td>
      <td>
        <v-avatar
          :size="24"
        >
          <img
            :src="'https://q.trapti.tech/static/icon/' + props.item.created_by_refer + '/64.png'"
            alt="avatar"
          >
        </v-avatar>
        @{{ props.item.created_by_refer }}
      </td>
    </template>
  </v-data-table>
</template>

<script>
import color from '@/utils/color'
export default {
  props: {
    groups: {
      type: Array,
      default: function(){
        return []
      }
    },
  },
  methods: {
    groupColor (groupID) {
      return color.GroupColors(groupID) + '--text'
    }
  }
}
</script>
