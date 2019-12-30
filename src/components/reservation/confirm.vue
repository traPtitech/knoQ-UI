<template>
  <v-card color="blue-grey lighten-3">
    <v-card-text>
      <v-container>
        <v-layout class="title">
          <v-flex>
            <div class="text-xs-left">予約: {{ reservation.name }}</div>
          </v-flex>
          <v-flex>
            <div class="text-xs-right">グループ: {{ groupName }}</div>
          </v-flex>
        </v-layout>
        <h6>説明</h6>
        <v-flex class="text-xs-left">
          <span v-html="renderedDescription" />
        </v-flex>
      </v-container>
      <RoomsExpansion :rooms="selectedRoom" />
      <v-flex mt-3 class="title">
        {{ reservation.time_start }} - {{ reservation.time_end }}
      </v-flex>
    </v-card-text>
  </v-card>
</template>

<script>
import RoomsExpansion from '@/components/room/expansion'
import { render } from '@/utils/markdown-it'

export default {
  components: {
    RoomsExpansion,
  },
  props: {
    reservation: {
      type: Object,
      default: function() {
        return {}
      },
    },
    selectedRoom: {
      type: Array,
      default: function() {
        return {}
      },
    },
  },
  data() {
    return {}
  },
  computed: {
    groupName: function() {
      console.log(this.reservation.group_id)
      let name = ''
      for (const group of this.$store.state.myGroups) {
        if (group.id === this.reservation.group_id) {
          name = group.name
          break
        }
      }
      return name
    },
    renderedDescription: function() {
      if (typeof this.reservation.description === 'undefined') return ''
      return render(this.reservation.description)
    },
  },
}
</script>
