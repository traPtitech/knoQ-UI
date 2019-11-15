<template>
  <v-chip @click="search" class="mr-3"> # {{ name }} </v-chip>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class Tag extends Vue {
  @Prop()
  name!: string

  search(): void {
    this.$router.push({ name: 'Search', query: { q: this.name } })
  }
}
</script>
