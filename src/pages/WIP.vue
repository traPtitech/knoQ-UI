<template>
  <v-container>
    <p class="display-1 text--secondary">
      Work in progress
      <v-icon x-large>mdi-account-hard-hat</v-icon>
    </p>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class WIP extends Vue {}
</script>
