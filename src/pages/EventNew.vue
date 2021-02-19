<template>
  <v-container>
    <event-form-base @submit="submit" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import EventFormBase, {
  EventInputContent,
} from '@/components/event/EventFormBase.vue'
import { isTrapGroup } from '@/workers/isTrapGroup'
import RepositoryFactory from '@/repositories/RepositoryFactory'

const EventsRepo = RepositoryFactory.get('events')

@Component({
  components: {
    EventFormBase,
  },
})
export default class EventNew extends Vue {
  async submit(event: EventInputContent) {
    if (!event.group || (!event.personal && !event.room)) {
      console.error('input content has null field')
      return
    }

    if (isTrapGroup(event.group)) {
      const confirmed = window.confirm(
        'traP部員全体が対象となるようなイベントを開催しようとしています。本当によろしいですか？'
      )
      if (!confirmed) return
    }
    if (event.personal) {
      const confirmed = window.confirm(
        'traPが予約していない場所でイベントを開催しようとしています。そこでイベントを開催できるか確認しましたか？'
      )
      if (!confirmed) return
    }

    try {
      const { eventId } = (
        await EventsRepo.post({
          name: event.name,
          description: event.description,
          tags: event.tags,
          groupId: event.group.groupId,
          timeStart: event.timeStart,
          timeEnd: event.timeEnd,
          sharedRoom: event.personal ? false : event.sharedRoom,
          admins: event.admins.map(user => user.userId),
          ...(event.personal
            ? { place: event.place }
            : { roomId: event.room!.roomId }),
        })
      ).data
      this.$router.push(`/events/${eventId}`)
    } catch (__) {
      alert('Failed to submit...')
    }
  }
}
</script>
