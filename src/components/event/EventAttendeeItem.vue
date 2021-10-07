<template>
  <div>
    <v-row align="center" style="width: 100%">
      <v-col class="flex-grow-0 mr-n3 text-no-wrap">
        <v-sheet
          v-if="state == 'pending'"
          outlined
          rounded
          :style="{
            'border-color': '#e8b645',
          }"
        >
          <span style="color: #e8b645" class="ma-1">未定</span>
        </v-sheet>
        <v-sheet
          v-if="state == 'attendance'"
          outlined
          rounded
          :style="{
            'border-color': $vuetify.theme.themes.light.primary,
          }"
        >
          <span class="primary--text ma-1">参加</span>
        </v-sheet>
        <v-sheet
          v-if="state == 'absent'"
          outlined
          rounded
          :style="{
            'border-color': $vuetify.theme.themes.light.secondary,
          }"
        >
          <span class="secondary--text ma-1">欠席</span>
        </v-sheet>
      </v-col>
      <v-col class="flex-grow-0 mr-n3">
        <div>
          <user-avatar
            size="36"
            :user-id="userId"
            user-icon="https://q.trap.jp/api/v3/public/icon/itt"
          />
        </div>
      </v-col>
      <v-col class="text-no-wrap">
        <span>{{ userId }} </span>
        <span v-if="isAdmin" class="secondary--text">(Admin)</span>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import UserAvatar from '@/components/shared/UserAvatar.vue'

@Component({
  components: {
    UserAvatar,
  },
})
export default class EventAttendeeItem extends Vue {
  @Prop({ type: String, required: true })
  userId!: string
  @Prop({ type: String, required: true })
  state!: string
  @Prop({ type: Boolean, required: true })
  isAdmin!: boolean
}
</script>
