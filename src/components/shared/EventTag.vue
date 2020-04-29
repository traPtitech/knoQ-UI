<template>
  <v-chip
    small
    label
    :to="to"
    :ripple="false"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <span class="text--secondary">{{ name }}</span>
  </v-chip>
</template>

<script lang="ts">
import Vue from 'vue'
import 'reflect-metadata'
import { Component, Prop } from 'vue-property-decorator'
import { RawLocation } from 'vue-router'

@Component
export default class EventTag extends Vue {
  @Prop({ required: true }) name!: string
  @Prop({ type: Boolean, default: false }) toTagPageOnClick!: boolean

  get to(): RawLocation | undefined {
    if (!this.toTagPageOnClick) {
      return undefined
    }
    return {
      path: '/events',
      query: { tags: this.name },
    }
  }
}
</script>
