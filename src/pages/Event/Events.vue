<template>
  <Layout>
    <h1 class="mb-5 display-1 font-weight-bold">Events</h1>
    <EventList />
  </Layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Layout from '@/components/shared/Layout.vue'
import EventList from '@/components/event/EventList/EventList.vue'

@Component({
  components: {
    Layout,
    EventList,
  },
})
export default class Events extends Vue {}
</script>
