<template>
  <div v-html="rendered" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { render } from '@/utils/markdown-it'

@Component
export default class MarkdownField extends Vue {
  @Prop()
  src!: string

  get rendered(): string {
    return render(this.src)
  }
}
</script>
