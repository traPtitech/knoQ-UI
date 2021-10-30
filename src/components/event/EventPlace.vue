<template>
  <div>
    <v-icon v-if="contains('youtube')" class="mb-1">mdi-youtube</v-icon>
    <v-icon v-if="contains('discord')" class="mb-1">mdi-discord</v-icon>
    <v-icon v-if="contains('zoom')" class="mb-1">mdi-video</v-icon>
    <v-icon v-if="contains('qall')" class="mb-1">mdi-phone</v-icon>
    {{ place }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class EventPlace extends Vue {
  @Prop({ type: String, required: true })
  place!: string

  contains(searchWord: string): boolean {
    return this.place.toLowerCase().indexOf(searchWord) !== -1
  }
}
</script>
