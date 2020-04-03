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
            item-value="name"
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
              <EventTag
                close
                :name="item.name"
                @click:close="removeTag(item)"
              />
            </template>
          </v-combobox>
        </div>
        <div class="text--secondary">
          <span class="mr-3">
            by
            <router-link :to="`/groups/${event.groupId}`">
              {{ group.name }}
            </router-link>
          </span>
        </div>
      </div>
      <div class="mb-5">
        <div class="text--secondary mb-n1">Date</div>
        <div class="headline">
          {{ formatDate(event.timeStart) }}
          <v-icon>mdi-chevron-right</v-icon>
          {{ formatDate(event.timeEnd) }}
        </div>
      </div>
      <div class="mb-5">
        <div class="text--secondary mb-n1">Place</div>
        <div class="headline">
          <a
            v-if="isTitechRoom(room.place)"
            :href="calcRoomPdfUrl(room.place)"
            target="_blank"
            rel="noreferer noopener"
            class="mr-3"
          >
            {{ room.place }}
          </a>
          <span v-else class="mr-3">{{ room.place }}</span>
        </div>
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
import RepositoryFactory from '@/repositories/RepositoryFactory'
import {
  formatDate,
  getDateStr,
  getTimeStr,
  DATETIME_DISPLAY_FORMAT,
} from '@/workers/date'
import { isTitechRoom, calcRoomPdfUrl } from '@/workers/TokyoTech'

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

  editedTags: { name: string }[] = []

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

  removeTag(tag: { name: string }) {
    this.editedTags = this.editedTags.filter(({ name }) => name !== tag.name)
  }

  get formatDate() {
    return formatDate(DATETIME_DISPLAY_FORMAT)
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
    this.editedTags = this.event.tags
  }

  async onTagEditEnd() {
    const tagNames = this.event.tags.map(({ name }) => name)
    const editedTagNames = this.editedTags.map(({ name }) => name)
    const added = difference(editedTagNames, tagNames)
    const deleted = difference(tagNames, editedTagNames)
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

  get isTitechRoom() {
    return isTitechRoom
  }

  get calcRoomPdfUrl() {
    return calcRoomPdfUrl
  }
}

function difference<T>(xs: T[], ys: T[]): T[] {
  return xs.filter(x => !ys.includes(x))
}
</script>
