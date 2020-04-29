<template>
  <v-card class="py-3">
    <v-card-title class="d-block text-center display-1">
      {{ place }}
    </v-card-title>
    <v-card-text class="text-center title font-weight-regular">
      {{ timeStart }}
      <v-icon class="mb-1">mdi-chevron-right</v-icon>
      {{ timeEnd }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class AssignedRoomDisplay extends Vue {
  @Prop({ type: String, required: true })
  place!: string

  @Prop({ type: String, required: true })
  timeStart!: string

  @Prop({ type: String, required: true })
  timeEnd!: string
}
</script>
