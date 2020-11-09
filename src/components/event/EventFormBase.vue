<template>
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
      <v-stepper-step :complete="step > 3" step="3"> 確認 </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items class="pb-1">
      <v-stepper-content step="1">
        <EventFormContent v-model="isValidContent" v-bind.sync="event" />
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
              v-bind.sync="event"
            />
          </v-tab-item>
          <v-tab-item class="pt-3">
            <EventFormReservationPrivate
              v-model="isValidPrivateRoom"
              v-bind.sync="room"
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
        <FormBackButton class="mr-2" @click="step = 2"> Back </FormBackButton>
        <FormNextButton @click="submit"> Submit </FormNextButton>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

interface Event {
  name: string
  description: string
  sharedRoom: boolean
  timeStart: string
  timeEnd: string
  room: Schemas.Room | null
  group: Schemas.Group | null
  tags: Schemas.Tag[]
}

const emptyEvent = (): Event => ({
  name: '',
  description: '',
  sharedRoom: false,
  timeStart: '',
  timeEnd: '',
  room: null,
  group: null,
  tags: [],
})

interface Room {
  place: string
  timeStart: string
  timeEnd: string
}

const emptyRoom = (): Room => ({
  place: '',
  timeStart: '',
  timeEnd: '',
})

@Component
export default class EventFormBase extends Vue {
  @Prop({ type: Object, default: emptyEvent() })
  event!: Event

  @Prop({ type: Function, default: () => {} })
  onSubmit!: (isPrivateRoom: boolean, room: Room, event: Event) => void

  room = emptyRoom()

  step = 1
  get tab(): number {
    return Number(this.isPrivateRoom)
  }
  set tab(t: number) {
    this.isPrivateRoom = Boolean(t)
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

  @Watch('room.timeStart')
  onRoomParamstimeStartChange() {
    this.event.timeStart = this.room.timeStart
  }
  @Watch('room.timeEnd')
  onRoomParamstimeEndtChange() {
    this.event.timeEnd = this.room.timeEnd
  }

  get eventSummary() {
    return {
      name: this.event.name,
      description: this.event.description,
      tags: this.event.tags,
      groupName: this.event.group?.name ?? '',
      place: this.isPrivateRoom
        ? this.room.place
        : this.event.room?.place ?? '',
      isPrivate: this.isPrivateRoom,
      sharedRoom: this.event.sharedRoom,
      timeStart: this.event.timeStart,
      timeEnd: this.event.timeEnd,
    }
  }

  get submit() {
    return () => this.onSubmit(this.isPrivateRoom, this.room, this.event)
  }
}
</script>
