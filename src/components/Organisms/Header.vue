<template>
  <v-app-bar app>
    <v-toolbar-title
      class="headline font-weight-bold"
      style="cursor: pointer"
      @click="$router.push({ name: 'Home' })"
    >
      Room
    </v-toolbar-title>
    <v-spacer />
    <Avatar :size="32" :traq-id="'wasabi'" />
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Avatar from '@/components/Molecules/Avatar.vue'

@Component({
  components: {
    Avatar,
  },
})
export default class Header extends Vue {}
</script>
