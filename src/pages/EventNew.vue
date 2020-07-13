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
          <v-tabs v-model="tab">
            <v-tab>進捗部屋で開催</v-tab>
            <v-tab>その他で開催</v-tab>
            <v-tab-item class="pt-3">
              <EventFormReservationPublic
                v-model="validPublic"
                v-bind.sync="reservationPublic"
              />
            </v-tab-item>
            <v-tab-item class="pt-3">
              <EventFormReservationPrivate
                v-model="validPrivate"
                v-bind.sync="reservationPrivate"
              />
            </v-tab-item>
          </v-tabs>
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
import { isTrapGroup } from '@/workers/isTrapGroup'
import RepositoryFactory from '@/repositories/RepositoryFactory'

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
    group: null as Schemas.Group | null,
  }

  isPrivate = false
  get tab(): number {
    return +this.isPrivate
  }
  set tab(t: number) {
    this.isPrivate = !!t
  }
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
        : this.reservationPublic.room?.place ?? '',
      sharedRoom: !this.isPrivate && this.reservationPublic.sharedRoom,
    }
  }

  async submitEvent() {
    if (this.content.group && isTrapGroup(this.content.group)) {
      const confirmed = window.confirm(
        'traP部員全体が対象となるようなイベントを開催しようとしています。本当によろしいですか？'
      )
      if (!confirmed) return
    }
    if (this.isPrivate) {
      const confirmed = window.confirm(
        'traPが予約していない場所でイベントを開催しようとしています。そこでイベントを開催できるか確認しましたか？'
      )
      if (!confirmed) return
    }
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
      const { eventId } = (
        await EventsRepo.post({
          ...this.content,
          groupId: this.content.group!.groupId,
          roomId,
          sharedRoom: this.isPrivate || this.reservationPublic.sharedRoom,
          timeStart: reservation.timeStart,
          timeEnd: reservation.timeEnd,
        })
      ).data
      this.$router.push(`/events/${eventId}`)
    } catch (__) {
      alert('Failed to submit...')
    }
  }
}
</script>
