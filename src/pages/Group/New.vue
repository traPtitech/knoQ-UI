<template>
  <Layout>
    <h1 class="mb-5 display-1 font-weight-bold">
      Create new group
    </h1>
    <v-stepper v-model="step" flat class="elevation-0">
      <v-stepper-header class="elevation-0">
        <v-stepper-step :complete="step > 1" step="1">
          Describe new group information
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="step > 2" step="2">
          Confirmation
        </v-stepper-step>
      </v-stepper-header>

      <v-divider />

      <v-stepper-items class="pb-1">
        <v-stepper-content step="1">
          <GroupForm v-model="valid" v-bind.sync="group" />
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
          <GroupFormSummary v-bind="group" />
          <v-btn rounded depressed @click="step = 1" class="mr-3">
            Back
          </v-btn>
          <v-btn color="primary" rounded depressed>
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
import GroupForm from '@/components/group/GroupForm.vue'
import GroupFormSummary from '@/components/group/GroupFormSummary.vue'
import Rules from '@/utils/rules'

@Component({
  components: {
    Layout,
    GroupForm,
    GroupFormSummary,
  },
})
export default class New extends Vue {
  valid = false
  step = 1

  group = {
    name: '',
    description: '',
    members: [],
    joinFreely: false,
  }
}
</script>
