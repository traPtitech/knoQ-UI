<template>
  <span>
    <v-icon v-if="contains('youtube')" class="mr-1" style="color: red"
      >mdi-youtube</v-icon
    >
    <v-icon v-if="contains('discord')" class="mr-1" style="color: #5865f2"
      >discord</v-icon
    >
    <v-icon v-if="contains('zoom')" class="mr-1" style="color: #2d8cff"
      >mdi-video</v-icon
    >
    <v-icon v-if="contains('qall')" class="mr-1" style="color: #00aca2"
      >mdi-phone</v-icon
    >
    {{ place }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class EventPlace extends Vue {
  @Prop({ type: String, required: true })
  place!: string

  contains(searchWord: string): boolean {
    return this.place.toLowerCase().includes(searchWord)
  }
}
</script>
