<template>
  <v-container>
    <progress-circular v-if="status === 'loading'" />
    <load-failed-text v-else-if="status === 'error'" />
    <template v-else-if="!canEdit">
      <v-icon large color="error" class="mr-5">mdi-alert-circle</v-icon>
      <span class="text--secondary headline">
        他の人が作ったイベントは編集できません
      </span>
    </template>
    <template v-else>
      <event-form-base :event="event" @submit="submit" />

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
import { Component } from 'vue-property-decorator'
import EventFormBase, { EventInput } from '@/components/event/EventFormBase.vue'
import ProgressCircular from '@/components/shared/ProgressCircular.vue'
import LoadFailedText from '@/components/shared/LoadFailedText.vue'
import { isTrapGroup } from '@/workers/isTrapGroup'
import api, { ResponseEvent, ResponseGroup, ResponseRoom } from '@/api'

@Component({
  components: {
    EventFormBase,
    ProgressCircular,
    LoadFailedText,
  },
})
export default class ProgressCircularEventEdit extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'

  event: EventInput | null = null
  canEdit = false

  get eventId() {
    return this.$route.params.id
  }

  async created() {
    this.status = 'loading'
    try {
      const event = await api.events.getEventDetail({ eventID: this.eventId })

      const me = this.$store.direct.state.me
      this.canEdit = me ? event.admins.includes(me.id) : false

      const findUser = (id: string) =>
        this.$store.direct.state.usersCache.users?.get(id)

      this.event = {
        ...event,
        admins: event.admins.flatMap(userId => findUser(userId) ?? []),
        ...(event.room.verified
          ? { instant: false, room: event.room }
          : { instant: true, place: event.room.place }),
      }
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }

  async submit(event: EventInput) {
    if (!event.group || (!event.instant && !event.room)) {
      console.error('input content has null field')
      return
    }

    if (isTrapGroup(event.group)) {
      const confirmed = window.confirm(
        'traP部員全体が対象となるようなイベントを開催しようとしています。本当によろしいですか？'
      )
      if (!confirmed) return
    }
    if (event.instant) {
      const confirmed = window.confirm(
        'traPが予約していない場所でイベントを開催しようとしています。そこでイベントを開催できるか確認しましたか？'
      )
      if (!confirmed) return
    }

    try {
      await api.events.updateEvent({
        eventID: this.eventId,
        requestEvent: {
          name: event.name,
          description: event.description,
          tags: event.tags,
          groupId: event.group.groupId,
          timeStart: event.timeStart,
          timeEnd: event.timeEnd,
          sharedRoom: event.instant ? false : event.sharedRoom,
          admins: event.admins.map(user => user.id),
          ...(event.instant
            ? { place: event.place }
            : { roomId: event.room!.roomId }),
        },
      })
      this.$router.push(`/events/${this.eventId}`)
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
      await api.events.deleteEvent({ eventID: this.eventId })
      this.$router.push('/')
    } catch (__) {
      alert('Failed to submit...')
    }
  }
}
</script>
