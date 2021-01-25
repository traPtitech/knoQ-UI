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
              :place.sync="place"
              :time-start.sync="event.timeStart"
              :time-end.sync="event.timeEnd"
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
import { Component, Prop } from 'vue-property-decorator'

export type Event = {
  name: string
  description: string
  sharedRoom: boolean
  timeStart: string
  timeEnd: string
  group: Schemas.Group | null
  tags: Schemas.Tag[]
  admins: Schemas.User['userId'][]
} & (
  | { isPrivateRoom: false; room: Schemas.Room | null }
  | { isPrivateRoom: true; place: string }
)

const emptyEvent = (): Event => ({
  name: '',
  description: '',
  sharedRoom: false,
  timeStart: '',
  timeEnd: '',
  isPrivateRoom: false,
  room: null,
  group: null,
  tags: [],
  admins: [],
})

@Component
export default class EventFormBase extends Vue {
  @Prop({ type: Object, default: emptyEvent() })
  event!: Event

  @Prop({ type: Function, default: () => {} })
  onSubmit!: (event: Event) => void

  place = ''

  step = 1
  get tab(): number {
    return Number(this.event.isPrivateRoom)
  }
  set tab(t: number) {
    this.event.isPrivateRoom = Boolean(t)
  }

  isValidContent = false
  isValidPublicRoom = false
  isValidPrivateRoom = false
  get isValidRoom(): boolean {
    return (
      (!this.event.isPrivateRoom && this.isValidPublicRoom) ||
      (this.event.isPrivateRoom && this.isValidPrivateRoom)
    )
  }

  get eventSummary() {
    return {
      name: this.event.name,
      description: this.event.description,
      tags: this.event.tags,
      groupName: this.event.group?.name ?? '',
      place: this.event.isPrivateRoom
        ? this.place
        : this.event.room?.place ?? '',
      isPrivate: this.event.isPrivateRoom,
      sharedRoom: this.event.sharedRoom,
      timeStart: this.event.timeStart,
      timeEnd: this.event.timeEnd,
    }
  }

  get submit() {
    return () => this.onSubmit(this.event)
  }
}
</script>
