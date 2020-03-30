<template>
  <v-container>
    <v-stepper v-model="step">
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
import { AvailableRoom } from '@/workers/availableRooms'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
import { jstToUtc } from '@/workers/date'

const RoomsRepo = RepositoryFactory.get('rooms')
const EventsRepo = RepositoryFactory.get('events')

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
export default class EventNew extends Vue {
  step = 1

  valid1 = false
  content = {
    name: '',
    tags: [] as { name: string }[],
    description: '',
    group: null as Schemas.Group,
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
    room: null as Schemas.Room,
    timeStart: '',
    timeEnd: '',
    sharedRoom: true,
  }
  reservationPrivate = {
    place: '',
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
      sharedRoom: this.isPrivate ? null : this.reservationPublic.sharedRoom,
    }
  }

  async submitEvent() {
    try {
      let roomId: string
      if (this.isPrivate) {
        roomId = (await RoomsRepo.private.post(this.reservationPrivate)).data
          .roomId
      } else {
        roomId = this.reservationPublic.room.roomId
      }
      const reservation = this.isPrivate
        ? this.reservationPrivate
        : this.reservationPublic
      const { eventId } = (await EventsRepo.post({
        ...this.content,
        groupId: this.content.group.groupId,
        roomId,
        sharedRoom: this.isPrivate ? true : this.reservationPublic.sharedRoom,
        timeStart: reservation.timeStart,
        timeEnd: reservation.timeEnd,
      })).data
      this.$router.push(`/events/${eventId}`)
    } catch (__) {
      alert('Failed to submit...')
    }
  }
}
</script>
