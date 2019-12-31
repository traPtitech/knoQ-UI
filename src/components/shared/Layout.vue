<template>
  <v-container fluid class="mx-4 py-2 py-sm-7">
    <v-row justify="center">
      <v-col sm="9" cols="12">
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Layout extends Vue {}
</script>
