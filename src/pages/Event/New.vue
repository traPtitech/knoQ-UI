<template>
  <Layout>
    <h1 class="mb-5 display-1 font-weight-bold">Create new event</h1>
    <v-stepper v-model="step" class="elevation-0">
      <v-stepper-header class="elevation-0">
        <v-stepper-step :complete="step > 1" step="1">
          Describe new event content
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="step > 2" step="2">
          Room
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="step > 3" step="3">
          Confirm
        </v-stepper-step>
      </v-stepper-header>

      <v-divider />

      <v-stepper-items class="pb-1">
        <v-stepper-content step="1">
          <EventContentForm v-model="valid" v-bind.sync="event" />
          <v-btn
            color="primary"
            rounded
            depressed
            :disabled="!valid"
            @click="step = 2"
          >
            Continue
          </v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <h2>Step 2</h2>
        </v-stepper-content>
        <v-stepper-content step="3">
          <h2>Step 3</h2>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </Layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Layout from '@/components/shared/Layout.vue'
import EventContentForm from '@/components/event/EventContentForm.vue'

@Component({
  components: {
    Layout,
    EventContentForm,
  },
})
export default class New extends Vue {
  step = 1

  valid = false

  event = {
    name: '',
    group: '',
    tags: [],
    description: '',
  }
}
</script>
