<template>
  <v-card flat class="px-3 px-md-6" color="grey lighten-4" :to="detailPagePath">
    <v-row align="center">
      <v-col class="flex-grow-0 mr-md-9">
        <div class="mb-4">{{ timeStart }}</div>
        <div>{{ timeEnd }}</div>
      </v-col>
      <v-col class="text-truncate">
        <span class="title">{{ title }}</span>
      </v-col>
      <v-col class="flex-grow-0">{{ place }}</v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class EventTape extends Vue {
  @Prop() id: number
  @Prop() title: string
  @Prop() timeStart: string
  @Prop() timeEnd: string
  @Prop() place: string

  get detailPagePath() {
    return `/events/${this.id}`
  }
}
</script>
