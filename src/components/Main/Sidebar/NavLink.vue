<template>
  <v-list-item link>
    <v-btn depressed rounded block @click="onClick()">
      <v-icon>{{ icon }}</v-icon>
      <v-list-item-title>
        {{ title }}
      </v-list-item-title>
    </v-btn>
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

  onClick() {
    this.$router.push(this.link)
  }
}
</script>
