<template>
  <div>
    <user-avatar
      :user-id="userId"
      user-icon="https://q.trap.jp/api/v3/public/icon/itt"
    />
    {{ userId }}
    {{ state }}
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

  async created() {}
}
</script>
