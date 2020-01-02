<template>
  <Layout>
    <p class="text-center display-1">
      Sorry, now work in progress...
    </p>
    <p class="text-center">
      <v-icon size="10rem">mdi-worker</v-icon>
    </p>
  </Layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Layout from '@/components/shared/Layout.vue'

@Component({
  components: {
    Layout,
  },
})
export default class WIP extends Vue {}
</script>
