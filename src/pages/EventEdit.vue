<template>
  <v-container>
    <ProgressCircular v-if="status === 'loading'" />
    <LoadFailedText v-else-if="status === 'error'" />
    <template v-else>
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
            <EventFormSummary v-bind="eventSummary" />
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
            <v-btn text color="secondary" @click="dialog = false">CANCEL</v-btn>
            <v-btn text color="error" @click="deleteEvent">DELETE</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
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
import ProgressCircular from '@/components/shared/ProgressCircular.vue'
import LoadFailedText from '@/components/shared/LoadFailedText.vue'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
import { formatDate } from '@/workers/date'

const EventsRepo = RepositoryFactory.get('events')
const RoomsRepo = RepositoryFactory.get('rooms')
const GroupsRepo = RepositoryFactory.get('groups')

@Component({
  components: {
    EventFormContent,
    EventFormReservationPublic,
    EventFormReservationPrivate,
    EventFormSummary,
    FormNextButton,
    FormBackButton,
    ProgressCircular,
    LoadFailedText,
  },
})
export default class EventEdit extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  dialog = false
  step = 1

  event: Schemas.Event = null
  room: Schemas.Room = null
  group: Schemas.Group = null

  async created() {
    await this.fetchEventData()
    this.assignEventData()
  }

  async fetchEventData() {
    const eventId = this.$route.params.id
    this.status = 'loading'
    try {
      this.event = (await EventsRepo.$eventId(eventId).get()).data
      ;[{ data: this.room }, { data: this.group }] = await Promise.all([
        RoomsRepo.$roomId(this.event.roomId).get(),
        GroupsRepo.$groupId(this.event.groupId).get(),
      ])
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }

  assignEventData() {
    this.content.name = this.event.name
    this.content.description = this.event.description
    this.content.tags = this.event.tags
    this.content.group = this.group
    if (this.room.public) {
      this.reservationPublic.room = this.room
      this.reservationPublic.timeStart = this.event.timeStart
      this.reservationPublic.timeEnd = this.event.timeEnd
      this.reservationPublic.sharedRoom = this.event.sharedRoom
    } else {
      this.reservationPrivate.place = this.room.place
      this.reservationPrivate.timeStart = formatDate()(this.room.timeStart)
      this.reservationPrivate.timeEnd = formatDate()(this.room.timeEnd)
    }
  }

  valid1 = false
  content = {
    name: '',
    tags: [],
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
  get eventSummary() {
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
      const { eventId } = (
        await EventsRepo.post({
          ...this.content,
          groupId: this.content.group.groupId,
          roomId,
          sharedRoom: this.isPrivate ? true : this.reservationPublic.sharedRoom,
          timeStart: reservation.timeStart,
          timeEnd: reservation.timeEnd,
        })
      ).data
      this.$router.push(`/events/${eventId}`)
    } catch (__) {
      alert('Failed to submit...')
    }
  }

  async deleteEvent() {
    const eventId = this.$route.params.id
    try {
      await EventsRepo.$eventId(eventId).delete()
      this.dialog = false
      this.$router.push('/')
    } catch (__) {
      alert('Failed to submit...')
    }
  }
}
</script>
