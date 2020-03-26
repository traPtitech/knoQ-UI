<template>
  <v-container>
    <v-stepper v-model="step" class="mb-5">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">
          イベント内容
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="step > 2" step="2">
          日時・場所
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="step > 3" step="3">
          確認
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items class="pb-1">
        <v-stepper-content step="1">
          <EventFormContent v-model="valid1" v-bind.sync="content" />
          <FormNextButton :disabled="!valid1" @click="step = 2">
            Continue
          </FormNextButton>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-checkbox
            v-model="isPrivate"
            label="traPが予約していない場所で開催する"
          />
          <EventFormReservationPublic
            v-show="!isPrivate"
            v-model="validPublic"
            v-bind.sync="reservationPublic"
          />
          <EventFormReservationPrivate
            v-show="isPrivate"
            v-model="validPrivate"
            v-bind.sync="reservationPrivate"
          />
          <FormBackButton class="mr-2" @click="step = 1">
            Back
          </FormBackButton>
          <FormNextButton :disabled="!valid2" @click="step = 3">
            Continue
          </FormNextButton>
        </v-stepper-content>
        <v-stepper-content step="3">
          <EventFormSummary v-bind="event" />
          <FormBackButton class="mr-2" @click="step = 2">
            Back
          </FormBackButton>
          <FormNextButton @click="submitEvent">
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
          <v-btn text color="secondary" @click="cancelDeletion">CANCEL</v-btn>
          <v-btn text color="error" @click="deleteEvent">DELETE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import EventFormContent from '@/components/event/EventFormContent.vue'
import EventFormReservationPublic from '@/components/event/EventFormReservationPublic.vue'
import EventFormReservationPrivate from '@/components/event/EventFormReservationPrivate.vue'
import EventFormSummary from '@/components/event/EventFormSummary.vue'
import FormNextButton from '@/components/shared/FormNextButton.vue'
import FormBackButton from '@/components/shared/FormBackButton.vue'

@Component({
  components: {
    EventFormContent,
    EventFormReservationPublic,
    EventFormReservationPrivate,
    EventFormSummary,
    FormNextButton,
    FormBackButton,
  },
})
export default class New extends Vue {
  dialog = false
  step = 1

  valid1 = false
  content = {
    name: '',
    tags: [],
    description: '',
    group: null,
  }

  isPrivate = false
  validPublic = false
  validPrivate = false
  get valid2(): boolean {
    return (
      (!this.isPrivate && this.validPublic) ||
      (this.isPrivate && this.validPrivate)
    )
  }
  reservationPublic = {
    room: null,
    timeStart: '',
    timeEnd: '',
    sharedRoom: true,
  }
  reservationPrivate = {
    place: '',
    date: '',
    timeStart: '',
    timeEnd: '',
  }

  // TODO: make more readable
  get event() {
    const reservation = this.isPrivate
      ? this.reservationPrivate
      : this.reservationPublic
    return {
      ...this.content,
      isPrivate: this.isPrivate,
      timeStart: reservation.timeStart,
      timeEnd: reservation.timeEnd,
      place: this.isPrivate
        ? this.reservationPrivate.place
        : this.reservationPublic.room && this.reservationPublic.room.place,
      date: this.isPrivate
        ? this.reservationPrivate.date
        : this.reservationPublic.room && this.reservationPublic.room.date,
      sharedRoom: this.isPrivate ? null : this.reservationPublic.sharedRoom,
    }
  }

  submitEvent() {}

  deleteEvent() {
    this.dialog = false
    alert('delete')
  }

  cancelDeletion() {
    this.dialog = false
  }
}
</script>
