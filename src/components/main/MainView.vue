<template>
  <v-content>
    <router-view />
  </v-content>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class MainView extends Vue {}
</script>
