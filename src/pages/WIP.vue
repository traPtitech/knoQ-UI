<template>
  <v-container>
    <p class="display-1 text--secondary">
      工事中だなも...
      <v-icon x-large>mdi-leaf</v-icon>
    </p>
    <p>
      <v-icon size="10rem">mdi-worker</v-icon>
    </p>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class WIP extends Vue {}
</script>
