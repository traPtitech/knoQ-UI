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
        <event-form-content v-model="validContent" v-bind.sync="content" />
        <form-next-button :disabled="!validContent" @click="step = 2">
          Continue
        </form-next-button>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-tabs v-model="tab">
          <v-tab>進捗部屋で開催</v-tab>
          <v-tab>その他で開催</v-tab>
          <v-tab-item class="pt-3">
            <event-form-time-and-place
              v-model="validTimeAndPlaceDefault"
              v-bind.sync="timeAndPlace"
            />
          </v-tab-item>
          <v-tab-item class="pt-3">
            <event-form-time-and-place-personal
              v-model="validTimeAndPlacePersonal"
              v-bind.sync="timeAndPlacePersonal"
            />
          </v-tab-item>
        </v-tabs>
        <form-back-button class="mr-2" @click="step = 1">Back</form-back-button>
        <form-next-button :disabled="!validTimeAndPlace" @click="step = 3">
          Continue
        </form-next-button>
      </v-stepper-content>

      <v-stepper-content step="3">
        <event-form-summary v-bind="summary" />
        <form-back-button class="mr-2" @click="step = 2">
          Back
        </form-back-button>
        <form-next-button @click="submit"> Submit </form-next-button>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import EventFormContent, {
  EventContent,
} from '@/components/event/EventFormContent.vue'
import EventFormTimeAndPlace, {
  EventTimeAndPlace,
} from '@/components/event/EventFormTimeAndPlace.vue'
import EventFormTimeAndPlacePersonal, {
  EventTimeAndPlacePersonal,
} from '@/components/event/EventFormTimeAndPlacePersonal.vue'
import EventFormSummary, {
  EventSummary,
} from '@/components/event/EventFormSummary.vue'
import FormNextButton from '@/components/shared/FormNextButton.vue'
import FormBackButton from '@/components/shared/FormBackButton.vue'

export type EventInputContent = EventContent &
  (
    | ({ personal: false } & EventTimeAndPlace)
    | ({ personal: true } & EventTimeAndPlacePersonal)
  )

enum TimeAndPlaceFormTab {
  Default = 0,
  Personal = 1,
}

@Component({
  components: {
    EventFormContent,
    EventFormTimeAndPlace,
    EventFormTimeAndPlacePersonal,
    EventFormSummary,
    FormNextButton,
    FormBackButton,
  },
})
export default class EventFormBase extends Vue {
  @Prop({ type: Object })
  event!: EventInputContent | null | undefined

  created() {
    const me = this.$store.direct.state.me
    if (me) {
      this.content.admins.push(me)
    }
  }

  content: EventContent = {
    name: this.event?.name ?? '',
    description: this.event?.description ?? '',
    group: this.event?.group ?? null,
    tags: this.event?.tags ?? [],
    admins: this.event?.admins ?? [],
  }

  timeAndPlace: EventTimeAndPlace = {
    timeStart: this.event && !this.event.personal ? this.event.timeStart : '',
    timeEnd: this.event && !this.event.personal ? this.event.timeEnd : '',
    room: this.event && !this.event.personal ? this.event.room : null,
    sharedRoom:
      this.event && !this.event.personal ? this.event.sharedRoom : true,
  }

  timeAndPlacePersonal: EventTimeAndPlacePersonal = {
    timeStart: this.event?.personal ? this.event.timeStart : '',
    timeEnd: this.event?.personal ? this.event.timeEnd : '',
    place: this.event?.personal ? this.event.place : '',
  }

  personal: boolean = this.event?.personal ?? false

  step = 1

  get tab(): number {
    return this.personal
      ? TimeAndPlaceFormTab.Personal
      : TimeAndPlaceFormTab.Default
  }
  set tab(t: number) {
    switch (t) {
      case TimeAndPlaceFormTab.Default:
        this.personal = false
        break
      case TimeAndPlaceFormTab.Personal:
        this.personal = true
        break
    }
  }

  validContent = false
  validTimeAndPlaceDefault = false
  validTimeAndPlacePersonal = false
  get validTimeAndPlace(): boolean {
    return (
      (!this.personal && this.validTimeAndPlaceDefault) ||
      (this.personal && this.validTimeAndPlacePersonal)
    )
  }

  get summary(): EventSummary {
    return {
      name: this.content.name,
      description: this.content.description,
      tags: this.content.tags,
      groupName: this.content.group?.name ?? '',
      place: this.personal
        ? this.timeAndPlacePersonal.place
        : this.timeAndPlace.room?.place ?? '',
      isPrivate: this.personal,
      sharedRoom: this.personal ? false : this.timeAndPlace.sharedRoom,
      timeStart: this.personal
        ? this.timeAndPlacePersonal.timeStart
        : this.timeAndPlace.timeStart,
      timeEnd: this.personal
        ? this.timeAndPlacePersonal.timeEnd
        : this.timeAndPlace.timeEnd,
    }
  }

  @Emit()
  submit(): EventInputContent {
    return {
      ...this.content,
      group: this.content.group!,
      ...(this.personal
        ? { personal: true, ...this.timeAndPlacePersonal }
        : { personal: false, ...this.timeAndPlace }),
    }
  }
}
</script>
