<template>
  <v-form>
    <v-card color="blue-grey lighten-3">
      <v-card-text>
        <v-container fluid>
          <v-layout class="title">
            <v-flex>
              <div class="text-xs-left">グループ名: {{ group.name }}</div>
            </v-flex>
            <v-flex>
              <div class="text-xs-right">人数:{{ group.members.length }}人</div>
            </v-flex>
          </v-layout>
          <h6>説明</h6>
          <span
            class="text-xs-left"
            v-html="markedDescription"
          />
        </v-container>
      </v-card-text>
    </v-card>
    <v-container
      fluid
      grid-list-md
      text-xs-left
    >
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="member in group.members.slice((pageSelected-1) * displayMemberNum, pageSelected * displayMemberNum)"
          :key="member.traq_id"
          xs12
          sm6
          md4
        >
          <v-card>
            <v-card-text>
              <v-avatar size="24">
                <img
                  :src="'https://q.trapti.tech/static/icon/' + member.traq_id + '/64.png'"
                  :alt="member.traq_id"
                >
              </v-avatar>
              <span style="margin-left:10px;">{{ member.traq_id }}</span>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex
          xs12
          text-xs-center
        >
          <v-pagination
            v-model="pageSelected"
            :length="Math.ceil(group.members.length / displayMemberNum)"
            total-visible="5"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import marked from 'marked'

export default {
  props: {
    group: {
      type: Object,
      default: function(){
        return {}
      }
    },
  },
  data () {
    return {
      pageSelected: 1,
      displayMemberNum: 24
    }
  },
  computed: {
    markedDescription: function () {
      if (typeof this.group.description === 'undefined') return ''
      return marked(this.group.description)
    }
  }
}
</script>
