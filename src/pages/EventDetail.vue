<template>
  <v-container>
    <ProgressCircular v-if="status === 'loading'" />
    <LoadFailedText v-else-if="status === 'error'" />
    <v-card v-else class="pa-9">
      <div class="mb-12">
        <h1 class="mb-1 display-1">{{ event.name }}</h1>
        <div class="mb-3">
          <template v-if="!isTagEditting">
            <EventTag
              v-for="tag in event.tags"
              :key="tag.name"
              :name="tag.name"
              class="mr-3"
            />
            <v-btn x-small icon title="Edit tags" @click="isTagEditting = true">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <v-combobox
            v-else
            v-model="editedTags"
            :loading="tagLoading"
            :items="tags"
            item-text="name"
            autofocus
            dense
            outlined
            chips
            clearable
            multiple
            @focus="onTagEditStart"
            @blur="onTagEditEnd"
          >
            <template #selection="{ item }">
              <EventTag close :name="item" @click:close="removeTag(item)" />
            </template>
          </v-combobox>
        </div>
        <div class="text--secondary">
          <span class="mr-3">by {{ group.name }}</span>
          <v-btn
            x-small
            outlined
            color="primary"
            :to="`/groups/${event.groupId}`"
          >
            Learn more
          </v-btn>
        </div>
      </div>
      <div class="mb-5">
        <div class="text--secondary mb-n1">Date</div>
        <div class="headline">
          {{ formatTime(event.timeStart) }}
          <v-icon>mdi-chevron-right</v-icon>
          {{ formatTime(event.timeEnd) }}
        </div>
      </div>
      <div class="mb-5">
        <div class="text--secondary mb-n1">Place</div>
        <div class="headline">{{ room.place }}</div>
        <div v-if="room.public" class="text--secondary body-2">
          <v-icon :color="sharedRoomIcon.color">
            {{ sharedRoomIcon.icon }}
          </v-icon>
          {{ sharedRoomString }}
        </div>
      </div>
      <div class="mb-5">
        <MarkdownField class="mt-10" :src="event.description" />
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import ProgressCircular from '@/components/shared/ProgressCircular.vue'
import LoadFailedText from '@/components/shared/LoadFailedText.vue'
import EventTag from '@/components/shared/EventTag.vue'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
import moment from 'moment'
import { getDateStr, getTimeStr, DISP_FORMAT } from '@/workers/date'

const EventsRepo = RepositoryFactory.get('events')
const RoomsRepo = RepositoryFactory.get('rooms')
const GroupsRepo = RepositoryFactory.get('groups')
const TagsRepo = RepositoryFactory.get('tags')

@Component({
  components: {
    ProgressCircular,
    LoadFailedText,
    EventTag,
    MarkdownField,
  },
})
export default class EventDetail extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  isTagEditting = false

  event: Schemas.Event = null
  room: Schemas.Room = null
  group: Schemas.Group = null
  tags: Schemas.Tag[] = []
  tagLoading = false

  editedTags: string[] = []

  async created() {
    const eventId = this.$route.params.id
    this.status = 'loading'
    try {
      this.event = (await EventsRepo.$eventId(eventId).get()).data
      ;[{ data: this.room }, { data: this.group }] = await Promise.all([
        RoomsRepo.$roomId(this.event.roomId).get(),
        GroupsRepo.$groupId(this.event.groupId).get(),
      ])
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }

  removeTag(name: string) {
    const index = this.editedTags.indexOf(name)
    if (index >= 0) this.editedTags.splice(index, 1)
  }

  get formatTime() {
    return (date: string) => moment(date).format(DISP_FORMAT)
  }

  get sharedRoomString(): string {
    return this.event.sharedRoom ? '部屋の共用可能' : '部屋の共用不可能'
  }

  get sharedRoomIcon() {
    return this.event.sharedRoom
      ? { icon: 'mdi-door-open', color: 'success' }
      : { icon: 'mdi-door-closed-lock', color: 'error' }
  }

  async onTagEditStart() {
    if (!this.tags.length) {
      this.tagLoading = true
      this.tags = (await TagsRepo.get()).data
      this.tagLoading = false
    }
    this.editedTags = this.event.tags.map(({ name }) => name)
  }

  async onTagEditEnd() {
    const tagNames = this.event.tags.map(({ name }) => name)
    const added = difference(this.editedTags, tagNames)
    const deleted = difference(tagNames, this.editedTags)
    const eventId = this.$route.params.id
    await Promise.all(
      added.map(name => EventsRepo.$eventId(eventId).tags.post({ name }))
    )
    await Promise.all(
      deleted.map(name =>
        EventsRepo.$eventId(eventId)
          .tags.$tagName(name)
          .delete()
      )
    )
    this.event = (await EventsRepo.$eventId(eventId).get()).data
    this.isTagEditting = false
    this.editedTags = []
  }
}

function difference<T>(xs: T[], ys: T[]): T[] {
  return xs.filter(x => !ys.includes(x))
}
</script>
