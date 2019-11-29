<template>
  <v-app-bar app color="orange">
    <v-toolbar-title
      class="headline font-weight-bold white--text"
      style="cursor: pointer"
      @click="$router.push({ name: 'Home' })"
    >
      QonnPass
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
