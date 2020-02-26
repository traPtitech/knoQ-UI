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
          Set schedule and place
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="step > 3" step="3">
          Confirmation
        </v-stepper-step>
      </v-stepper-header>

      <v-divider />

      <v-stepper-items class="pb-1">
        <v-stepper-content step="1">
          <EventContentForm v-model="valid1" v-bind.sync="event" />
          <v-btn
            color="primary"
            rounded
            depressed
            :disabled="!valid1"
            @click="step = 2"
          >
            Continue
          </v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <EventReservationForm v-model="valid2" v-bind.sync="event" />
          <v-btn rounded depressed class="mr-2" @click="step = 1">
            Back
          </v-btn>
          <v-btn
            color="primary"
            rounded
            depressed
            :disabled="!valid2"
            @click="step = 3"
          >
            Continue
          </v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <EventFormSummary v-bind="event" />
          <v-btn rounded depressed class="mr-2" @click="step = 2">
            Back
          </v-btn>
          <v-btn color="primary" rounded depressed @click="submitNewEvent()">
            Submit
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </Layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Layout from '@/components/shared/Layout.vue'
import EventContentForm from '@/components/event/EventForm/EventContentForm.vue'
import EventReservationForm from '@/components/event/EventForm/EventReservationForm.vue'
import EventFormSummary from '@/components/event/EventForm/EventFormSummary.vue'

@Component({
  components: {
    Layout,
    EventContentForm,
    EventReservationForm,
    EventFormSummary,
  },
})
export default class New extends Vue {
  step = 1

  valid1 = false
  valid2 = false

  event = {
    name: '',
    group: '',
    room: '',
    tags: [],
    description: '',
  }

  submitNewEvent() {
    alert(JSON.stringify(this.event))
  }
}
</script>
