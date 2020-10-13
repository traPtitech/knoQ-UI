<template>
  <v-container>
    <ProgressCircular v-if="status === 'loading'" />
    <LoadFailedText v-else-if="status === 'error'" />
    <template v-else-if="!canEdit">
      <v-icon large color="error" class="mr-5">mdi-alert-circle</v-icon>
      <span class="text--secondary headline"
        >他の人が作ったイベントは編集できません</span
      >
    </template>
    <template v-else>
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
            <FormBackButton class="mr-2" @click="step = 1">Back</FormBackButton>
            <FormNextButton :disabled="!isValidRoom" @click="step = 3">
              Continue
            </FormNextButton>
          </v-stepper-content>

          <v-stepper-content step="3">
            <EventFormSummary v-bind="eventSummary" />
            <FormBackButton class="mr-2" @click="step = 2">
              Back
            </FormBackButton>
            <FormNextButton @click="submitEvent"> Submit </FormNextButton>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <v-card class="px-5 pt-5 pb-3">
        <span class="headline mr-3"> Delete this event </span>
        <v-btn small depressed color="error" class="mb-2" @click="deleteEvent">
          Delete
        </v-btn>
      </v-card>
    </template>
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
import ProgressCircular from '@/components/shared/ProgressCircular.vue'
import LoadFailedText from '@/components/shared/LoadFailedText.vue'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import { formatDate } from '@/workers/date'
import { isTrapGroup } from '@/workers/isTrapGroup'

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

  step = 1
  get tab(): number {
    return +this.isPrivateRoom
  }
  set tab(t: number) {
    this.isPrivateRoom = !!t
  }

  canEdit = true
  async created() {
    this.status = 'loading'
    try {
      const eventId = this.$route.params.id
      const event = (await EventsRepo.$eventId(eventId).get()).data
      const res = await Promise.all([
        RoomsRepo.$roomId(event.roomId).get(),
        GroupsRepo.$groupId(event.groupId).get(),
      ])
      const room = res[0].data
      const group = res[1].data

      this.canEdit = event.createdBy === this.$store.direct.state.me?.userId
      this.eventReified = {
        name: event.name,
        description: event.description,
        tags: event.tags,
        group,
        room,
        timeStart: event.timeStart,
        timeEnd: event.timeEnd,
        sharedRoom: event.sharedRoom,
      }
      if (!room.public) {
        this.roomParams = {
          place: room.place,
          timeStart: room.timeStart,
          timeEnd: room.timeEnd,
        }
      }
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
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

      const eventId = this.$route.params.id
      await EventsRepo.$eventId(eventId).put({
        name: this.eventReified.name,
        description: this.eventReified.description,
        tags: this.eventReified.tags,
        groupId: this.eventReified.group!.groupId,
        roomId,
        timeStart: this.eventReified.timeStart,
        timeEnd: this.eventReified.timeEnd,
        sharedRoom: this.eventReified.sharedRoom,
      })
      this.$router.push(`/events/${eventId}`)
    } catch (__) {
      alert('Failed to submit...')
    }
  }

  async deleteEvent() {
    const confirmed = window.confirm(
      'この操作は取り消せません。本当にこのイベントを削除してもよろしいですか？'
    )
    if (!confirmed) return
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
