<template>
  <v-autocomplete
    v-bind="$attrs"
    :search-input.sync="searchInput"
    v-on="$listeners"
    @input="searchInput = ''"
  >
    <slot v-for="(_, name) in $slots" :slot="name" :name="name" />
    <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="data">
      <slot :name="name" v-bind="data" />
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Autocomplete extends Vue {
  searchInput: string = ''
}
</script>
