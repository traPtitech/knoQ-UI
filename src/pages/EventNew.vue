<template>
  <v-container>
    <progress-circular v-if="status === 'loading'" />
    <load-failed-text v-else-if="status === 'error'" />
    <template v-else>
      <event-form-base :event="event" @submit="submit" />
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import EventFormBase, {
  EventInput,
  EventOutput,
} from '@/components/event/EventFormBase.vue'
import { isTrapGroup } from '@/workers/isTrapGroup'
import api from '@/api'
import LoadFailedText from '@/components/shared/LoadFailedText.vue'

@Component({
  components: {
    EventFormBase,
    LoadFailedText,
  },
})
export default class EventNew extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'

  event: EventInput | null = null

  get eventId() {
    return this.$route.query.baseID.toString()
  }

  async created() {
    this.status = 'loading'
    try {
      const event = await api.events.getEventDetail({ eventID: this.eventId })

      const findUser = (id: string) =>
        this.$store.direct.state.usersCache.users?.get(id)

      this.event = {
        name: event.name,
        group: event.group,
        admins: event.admins.flatMap(userId => findUser(userId) ?? []),
        tags: event.tags,
        description: event.description,
        ...(event.room.verified
          ? { instant: false }
          : { instant: true, place: event.room.place }),
      }
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }
  async submit(event: EventOutput) {
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
      const { eventId } = await api.events.addEvents({
        requestEvent: {
          name: event.name,
          description: event.description,
          tags: event.tags,
          groupId: event.group.groupId,
          timeStart: event.timeStart,
          timeEnd: event.timeEnd,
          sharedRoom: event.instant ? false : event.sharedRoom,
          admins: event.admins.map(user => user.userId),
          ...(event.instant
            ? { place: event.place }
            : { roomId: event.room!.roomId }),
        },
      })
      this.$router.push(`/events/${eventId}`)
    } catch (__) {
      alert('Failed to submit...')
    }
  }
}
</script>
