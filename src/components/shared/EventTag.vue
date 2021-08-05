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
import { Component, Prop } from 'vue-property-decorator'
import { RawLocation } from 'vue-router'

@Component
export default class EventTag extends Vue {
  @Prop({ type: String, required: true })
  name!: string

  @Prop({ type: Boolean, default: false })
  toTagPageOnClick!: boolean

  get to(): RawLocation | undefined {
    if (!this.toTagPageOnClick) {
      return undefined
    }
    return {
      path: '/events',
      query: {
        tags: this.name,
        // TODO: remove showFinished
        // this is required in order to retain the showFinished query in EventSearch page
        showFinished: this.$route.query.showFinished,
      },
    }
  }
}
</script>
