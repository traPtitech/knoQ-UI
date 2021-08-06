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
            <event-form-time-and-place-instant
              v-model="validTimeAndPlacePersonal"
              v-bind.sync="timeAndPlaceInstant"
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
  EventInputContent,
} from '@/components/event/EventFormContent.vue'
import EventFormTimeAndPlace, {
  EventInputTimeAndPlace,
} from '@/components/event/EventFormTimeAndPlace.vue'
import EventFormTimeAndPlaceInstant, {
  EventInputTimeAndPlaceInstant,
} from '@/components/event/EventFormTimeAndPlaceInstant.vue'
import EventFormSummary, {
  EventSummary,
} from '@/components/event/EventFormSummary.vue'
import FormNextButton from '@/components/shared/FormNextButton.vue'
import FormBackButton from '@/components/shared/FormBackButton.vue'

export type EventInput = EventInputContent &
  (
    | ({ instant: false } & Partial<EventInputTimeAndPlace>)
    | ({ instant: true } & Partial<EventInputTimeAndPlaceInstant>)
  )

export type EventOutput = EventInputContent &
  (
    | ({ instant: false } & EventInputTimeAndPlace)
    | ({ instant: true } & EventInputTimeAndPlaceInstant)
  )

enum TimeAndPlaceFormTab {
  Default = 0,
  Personal = 1,
}

@Component({
  components: {
    EventFormContent,
    EventFormTimeAndPlace,
    EventFormTimeAndPlaceInstant,
    EventFormSummary,
    FormNextButton,
    FormBackButton,
  },
})
export default class EventFormBase extends Vue {
  @Prop({ type: Object })
  event!: EventInput | null | undefined

  content: EventInputContent = null!

  timeAndPlace: EventInputTimeAndPlace = null!

  timeAndPlaceInstant: EventInputTimeAndPlaceInstant = null!

  instant: boolean = null!

  created() {
    this.content = {
      name: this.event?.name ?? '',
      description: this.event?.description ?? '',
      group: this.event?.group ?? null,
      tags: this.event?.tags ?? [],
      admins:
        this.event?.admins ??
        (this.$store.direct.state.me ? [this.$store.direct.state.me] : []),
    }
    this.timeAndPlace = {
      timeStart:
        this.event && !this.event.instant ? this.event.timeStart ?? '' : '',
      timeEnd:
        this.event && !this.event.instant ? this.event.timeEnd ?? '' : '',
      room: this.event && !this.event.instant ? this.event.room ?? null : null,
      sharedRoom:
        this.event && !this.event.instant
          ? this.event.sharedRoom ?? true
          : true,
    }
    this.timeAndPlaceInstant = {
      timeStart: this.event?.instant ? this.event.timeStart ?? '' : '',
      timeEnd: this.event?.instant ? this.event.timeEnd ?? '' : '',
      place: this.event?.instant ? this.event.place ?? '' : '',
    }
    this.instant = this.event?.instant ?? false
  }

  step = 1

  get tab(): number {
    return this.instant
      ? TimeAndPlaceFormTab.Personal
      : TimeAndPlaceFormTab.Default
  }
  set tab(t: number) {
    switch (t) {
      case TimeAndPlaceFormTab.Default:
        this.instant = false
        break
      case TimeAndPlaceFormTab.Personal:
        this.instant = true
        break
    }
  }

  validContent = false
  validTimeAndPlaceDefault = false
  validTimeAndPlacePersonal = false
  get validTimeAndPlace(): boolean {
    return (
      (!this.instant && this.validTimeAndPlaceDefault) ||
      (this.instant && this.validTimeAndPlacePersonal)
    )
  }

  get summary(): EventSummary {
    return {
      name: this.content.name,
      description: this.content.description,
      tags: this.content.tags,
      groupName: this.content.group?.name ?? '',
      place: this.instant
        ? this.timeAndPlaceInstant.place
        : this.timeAndPlace.room?.place ?? '',
      isPrivate: this.instant,
      sharedRoom: this.instant ? false : this.timeAndPlace.sharedRoom,
      timeStart: this.instant
        ? this.timeAndPlaceInstant.timeStart
        : this.timeAndPlace.timeStart,
      timeEnd: this.instant
        ? this.timeAndPlaceInstant.timeEnd
        : this.timeAndPlace.timeEnd,
    }
  }

  @Emit()
  submit(): EventOutput {
    return {
      ...this.content,
      group: this.content.group!,
      ...(this.instant
        ? { instant: true, ...this.timeAndPlaceInstant }
        : { instant: false, ...this.timeAndPlace }),
    }
  }
}
</script>
