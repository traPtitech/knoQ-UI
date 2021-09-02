<template>
  <v-avatar :size="size" :title="traqId">
    <img :src="userIcon" :alt="traqId" />
  </v-avatar>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class TrapAvatar extends Vue {
  @Prop({ type: String, required: true })
  size!: string

  @Prop({ type: String, required: true })
  traqId!: string

  @Prop({ type: String, required: true })
  userIcon!: string
}
</script>
