<template>
  <v-dialog v-model="dialog" width="500">
    <template #activator="{ on }">
      <FormNextButton v-on="on">
        Submit
      </FormNextButton>
    </template>
    <v-card>
      <v-card-title>
        確認
      </v-card-title>
      <v-card-text>
        <div>
          traPが予約していない場所でイベントを開催しようとしています
        </div>
        <div>
          そこでイベントを開催できるのかを確認した上でフォームを提出してください
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text color="secondary" @click="dialog = false">
          Cancel
        </v-btn>
        <v-btn text color="primary" @click="onConfirm">
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import 'reflect-metadata'
import { Component, Emit, Prop } from 'vue-property-decorator'
import FormNextButton from '@/components/shared/FormNextButton.vue'

@Component({
  components: {
    FormNextButton,
  },
})
export default class PrivateRoomConfirmationDialog extends Vue {
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
