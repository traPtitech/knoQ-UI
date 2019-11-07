<template>
  <v-avatar :size="size">
    <img
      :src="`https://q.trapti.tech/static/icon/${traqId}/64.png`"
      alt="avatar"
    />
  </v-avatar>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class Avatar extends Vue {
  @Prop()
  size!: number

  @Prop()
  traqId!: string
}
</script>
