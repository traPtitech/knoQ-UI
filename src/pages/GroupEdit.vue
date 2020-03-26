<template>
  <v-container>
    <v-stepper v-model="step" class="mb-5">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">
          グループ詳細
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="step > 2" step="2">
          確認
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <GroupFormContent v-model="valid" v-bind.sync="group" />
          <FormNextButton :disabled="!valid" @click="step = 2">
            Continue
          </FormNextButton>
        </v-stepper-content>

        <v-stepper-content step="2">
          <GroupFormSummary v-bind="group" />
          <FormBackButton class="mr-3" @click="step = 1">
            Back
          </FormBackButton>
          <FormNextButton @click="onSubmit">
            Submit
          </FormNextButton>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <v-dialog v-model="dialog" width="500">
      <template #activator="{ on }">
        <v-card class="px-5 pt-5 pb-3">
          <span class="headline mr-3">Delete this event</span>
          <v-btn small depressed color="error" class="mb-2" v-on="on">
            Delete
          </v-btn>
        </v-card>
      </template>
      <v-card>
        <v-card-title>
          CAUTION
        </v-card-title>
        <v-card-text>
          This operation cannot be undone. Are you sure?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="secondary" @click="onCancel">CANCEL</v-btn>
          <v-btn text color="error" @click="onDelete">DELETE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import GroupFormContent from '@/components/group/GroupFormContent.vue'
import GroupFormSummary from '@/components/group/GroupFormSummary.vue'
import FormNextButton from '@/components/shared/FormNextButton.vue'
import FormBackButton from '@/components/shared/FormBackButton.vue'

@Component({
  components: {
    GroupFormContent,
    GroupFormSummary,
    FormNextButton,
    FormBackButton,
  },
})
export default class New extends Vue {
  dialog = false
  valid = false
  step = 1

  group = {
    name: '',
    description: '',
    members: [],
    open: false,
  }

  onSubmit() {}
  onDelete() {
    this.dialog = false
  }
  onCancel() {
    this.dialog = false
  }
}
</script>
