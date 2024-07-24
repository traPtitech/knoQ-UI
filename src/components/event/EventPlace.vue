<template>
  <span>
    <v-icon v-if="contains('youtube')" class="mr-1" style="color: red"
      >mdi-youtube</v-icon
    >
    <v-icon v-if="contains('discord')" class="mr-1" style="color: #5865f2"
      >discord</v-icon
    >
    <v-icon v-if="contains('qall')" class="mr-1" style="color: #00aca2"
      >mdi-phone</v-icon
    >
    <Icon
      v-if="contains('zoom')"
      class="mr-1"
      style="color: #2d8cff; vertical-align: -0.25rem"
      icon="bxl:zoom"
    />
    {{ place }}
  </span>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue2'
const props = defineProps<{
  place: string
}>()

const contains = (searchWord: string) =>
  props.place.toLocaleLowerCase().includes(searchWord)
</script>
