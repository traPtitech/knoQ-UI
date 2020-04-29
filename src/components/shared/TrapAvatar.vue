<template>
  <v-avatar :size="size" :title="traqId">
    <img
      :src="`https://q.trap.jp/api/1.0/public/icon/${traqId}`"
      :alt="traqId"
    />
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
}
</script>
