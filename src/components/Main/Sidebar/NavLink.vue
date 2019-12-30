<template>
  <v-list-item link>
    <v-list-item-icon>
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <router-link :to="link">
        <v-list-item-title>
          {{ title }}
        </v-list-item-title>
      </router-link>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class NavLink extends Vue {
  @Prop()
  title!: string

  @Prop()
  link!: string

  @Prop()
  icon!: string
}
</script>
