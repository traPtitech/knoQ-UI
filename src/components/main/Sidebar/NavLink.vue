<template>
  <v-list-item link :to="link" color="primary">
    <v-list-item-icon>
      <v-icon> {{ icon }} </v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title> {{ title }} </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class NavLink extends Vue {
  @Prop() title!: string
  @Prop() link!: string
  @Prop() icon!: string
}
</script>
