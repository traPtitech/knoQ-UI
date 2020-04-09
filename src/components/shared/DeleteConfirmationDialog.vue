<template>
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
        <v-btn text color="secondary" @click="dialog = false">
          CANCEL
        </v-btn>
        <v-btn text color="error" @click="onConfirm">DELETE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import 'reflect-metadata'
import { Component, Emit, Prop } from 'vue-property-decorator'

@Component
export default class DeleteConfirmationDialog extends Vue {
  @Prop({ required: true }) value!: boolean

  @Emit('confirm')
  onConfirm() {
    this.dialog = false
  }

  get dialog(): boolean {
    return this.value
  }
  set dialog(value: boolean) {
    this.$emit('input', value)
  }
}
</script>
