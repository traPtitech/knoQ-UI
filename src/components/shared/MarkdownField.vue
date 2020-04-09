<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="rendered" />
</template>

<script lang="ts">
import Vue from 'vue'
import 'reflect-metadata'
import { Component, Prop } from 'vue-property-decorator'
import { render } from '@/workers/markdown-it'

@Component
export default class MarkdownField extends Vue {
  @Prop({ required: true }) src!: string

  get rendered(): string {
    return render(this.src)
  }
}
</script>

<style src="highlight.js/styles/atom-one-light.css" />
