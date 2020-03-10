<template>
  <v-chip small label>
    <span class="text--secondary">{{ name }}</span>
  </v-chip>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class EventTag extends Vue {
  @Prop() name!: string
}
</script>
