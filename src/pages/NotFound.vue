<template>
  <v-container>
    <h1 class="display-1 font-weight-bold">
      404 - File not found
      <v-icon class="display-1 mt-n2">mdi-emoticon-cry-outline</v-icon>
    </h1>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class NotFound extends Vue {}
</script>
