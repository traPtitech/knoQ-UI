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
            <FormNextButton v-if="!isPrivate" @click="submitEvent">
              Submit
            </FormNextButton>
            <PrivateRoomConfirmationDialog
              v-else
              v-model="dialog"
              @confirm="submitEvent"
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <DeleteConfirmationDialog v-model="dialog2" @confirm="deleteEvent" />
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
import PrivateRoomConfirmationDialog from '@/components/event/PrivateRoomConfirmationDialog.vue'
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog.vue'
import RepositoryFactory from '@/repositories/RepositoryFactory'
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
    PrivateRoomConfirmationDialog,
    DeleteConfirmationDialog,
  },
})
export default class EventEdit extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  dialog = false
  dialog2 = false
  step = 1

  event: Schemas.Event | null = null
  room: Schemas.Room | null = null
  group: Schemas.Group | null = null

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
    this.content.name = this.event?.name ?? ''
    this.content.description = this.event?.description ?? ''
    this.content.tags = this.event?.tags ?? []
    this.content.group = this.group
    if (this.room?.public) {
      this.isPrivate = false
      this.reservationPublic.room = this.room
      this.reservationPublic.timeStart = formatDate()(this.event!.timeStart)
      this.reservationPublic.timeEnd = formatDate()(this.event!.timeEnd)
      this.reservationPublic.sharedRoom = this.event?.sharedRoom ?? false
    } else {
      this.isPrivate = true
      this.reservationPrivate.place = this.room?.place ?? ''
      this.reservationPrivate.timeStart = formatDate()(this.room!.timeStart)
      this.reservationPrivate.timeEnd = formatDate()(this.room!.timeEnd)
    }
  }

  valid1 = false
  content = {
    name: '',
    tags: [] as { name: string }[],
    description: '',
    group: null as Schemas.Group | null,
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
    room: null as Schemas.Room | null,
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
        : this.reservationPublic.room?.place,
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
        roomId = this.reservationPublic.room!.roomId
      }
      const reservation = this.isPrivate
        ? this.reservationPrivate
        : this.reservationPublic
      const eventId = this.$route.params.id
      await EventsRepo.$eventId(eventId).put({
        ...this.content,
        groupId: this.content.group!.groupId,
        roomId,
        sharedRoom: !this.isPrivate && this.reservationPublic.sharedRoom,
        timeStart: reservation.timeStart,
        timeEnd: reservation.timeEnd,
      })
      this.$router.push(`/events/${eventId}`)
    } catch (__) {
      alert('Failed to submit...')
    }
  }

  async deleteEvent() {
    const eventId = this.$route.params.id
    try {
      await EventsRepo.$eventId(eventId).delete()
      this.$router.push('/')
    } catch (__) {
      alert('Failed to submit...')
    }
  }
}
</script>
