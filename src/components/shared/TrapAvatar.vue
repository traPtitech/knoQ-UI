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
import 'reflect-metadata'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class TrapAvatar extends Vue {
  @Prop({ required: true }) size!: number
  @Prop({ required: true }) traqId!: string
}
</script>
