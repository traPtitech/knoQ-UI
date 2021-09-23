<template>
  <v-avatar :size="size" :title="userId">
    <img :src="userIcon" :alt="userId" />
  </v-avatar>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class UserAvatar extends Vue {
  @Prop({ type: String, required: true })
  size!: string

  @Prop({ type: String, required: true })
  userId!: string

  @Prop({ type: String, required: false })
  userIcon!: string
}
</script>
