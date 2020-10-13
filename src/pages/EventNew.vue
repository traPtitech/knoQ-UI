<template>
  <v-container>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1"
          >イベント内容</v-stepper-step
        >
        <v-divider />
        <v-stepper-step :complete="step > 2" step="2"
          >日時・場所</v-stepper-step
        >
        <v-divider />
        <v-stepper-step :complete="step > 3" step="3"> 確認 </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items class="pb-1">
        <v-stepper-content step="1">
          <EventFormContent
            v-model="isValidContent"
            v-bind.sync="eventReified"
          />
          <FormNextButton :disabled="!isValidContent" @click="step = 2">
            Continue
          </FormNextButton>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-tabs v-model="tab">
            <v-tab>進捗部屋で開催</v-tab>
            <v-tab>その他で開催</v-tab>
            <v-tab-item class="pt-3">
              <EventFormReservationPublic
                v-model="isValidPublicRoom"
                v-bind.sync="eventReified"
              />
            </v-tab-item>
            <v-tab-item class="pt-3">
              <EventFormReservationPrivate
                v-model="isValidPrivateRoom"
                v-bind.sync="roomParams"
              />
            </v-tab-item>
          </v-tabs>
          <FormBackButton class="mr-2" @click="step = 1"> Back </FormBackButton>
          <FormNextButton :disabled="!isValidRoom" @click="step = 3">
            Continue
          </FormNextButton>
        </v-stepper-content>

        <v-stepper-content step="3">
          <EventFormSummary v-bind="eventSummary" />
          <FormBackButton class="mr-2" @click="step = 2"> Back </FormBackButton>
          <FormNextButton @click="submitEvent"> Submit </FormNextButton>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
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
  get tab(): number {
    return +this.isPrivateRoom
  }
  set tab(t: number) {
    this.isPrivateRoom = !!t
  }

  isValidContent = false
  isPrivateRoom = false
  isValidPublicRoom = false
  isValidPrivateRoom = false
  get isValidRoom(): boolean {
    return (
      (!this.isPrivateRoom && this.isValidPublicRoom) ||
      (this.isPrivateRoom && this.isValidPrivateRoom)
    )
  }

  eventReified = {
    name: '',
    description: '',
    tags: [] as { name: string }[],
    timeStart: '',
    timeEnd: '',
    group: null as Schemas.Group | null,
    room: null as Schemas.Room | null,
    sharedRoom: true,
  }

  roomParams = {
    place: '',
    timeStart: '',
    timeEnd: '',
  }

  @Watch('roomParams.timeStart')
  onRoomParamstimeStartChange() {
    this.eventReified.timeStart = this.roomParams.timeStart
  }
  @Watch('roomParams.timeEnd')
  onRoomParamstimeEndtChange() {
    this.eventReified.timeEnd = this.roomParams.timeEnd
  }

  get eventSummary() {
    return {
      name: this.eventReified.name,
      description: this.eventReified.description,
      tags: this.eventReified.tags,
      groupName: this.eventReified.group?.name ?? '',
      place: this.isPrivateRoom
        ? this.roomParams.place
        : this.eventReified.room?.place ?? '',
      isPrivate: this.isPrivateRoom,
      sharedRoom: this.eventReified.sharedRoom,
      timeStart: this.eventReified.timeStart,
      timeEnd: this.eventReified.timeEnd,
    }
  }

  async submitEvent() {
    if (this.eventReified.group && isTrapGroup(this.eventReified.group)) {
      const confirmed = window.confirm(
        'traP部員全体が対象となるようなイベントを開催しようとしています。本当によろしいですか？'
      )
      if (!confirmed) return
    }
    if (this.isPrivateRoom) {
      const confirmed = window.confirm(
        'traPが予約していない場所でイベントを開催しようとしています。そこでイベントを開催できるか確認しましたか？'
      )
      if (!confirmed) return
    }

    try {
      let roomId: string
      if (this.isPrivateRoom) {
        roomId = (await RoomsRepo.private.post(this.roomParams)).data.roomId
      } else {
        roomId = this.eventReified.room!.roomId
      }

      const { eventId } = (
        await EventsRepo.post({
          name: this.eventReified.name,
          description: this.eventReified.description,
          tags: this.eventReified.tags,
          groupId: this.eventReified.group!.groupId,
          roomId,
          timeStart: this.eventReified.timeStart,
          timeEnd: this.eventReified.timeEnd,
          sharedRoom: this.eventReified.sharedRoom,
        })
      ).data
      this.$router.push(`/events/${eventId}`)
    } catch (__) {
      alert('Failed to submit...')
    }
  }
}
</script>
