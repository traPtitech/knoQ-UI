<template>
  <v-container>
    <ProgressCircular v-if="status === 'loading'" />
    <LoadFailedText v-else-if="status === 'error'" />
    <v-card v-else-if="event" class="pa-9">
      <div class="mb-12">
        <v-row no-gutters>
          <v-col>
            <h1 class="mb-1 display-1">{{ event.name }}</h1>
          </v-col>
          <v-col class="flex-grow-0">
            <ActionMenu>
              <v-list-item
                v-if="isMyEvent"
                :to="`/events/edit/${event.eventId}`"
              >
                <v-list-item-title>Edit this event</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="isMyEvent"
                :to="`/events/new?baseID=${event.eventId}`"
              >
                <v-list-item-title>Create new</v-list-item-title>
              </v-list-item>
            </ActionMenu>
          </v-col>
        </v-row>
        <div class="mb-3">
          <template v-if="!isTagEditting">
            <span v-if="!event.tags.length" class="text--secondary">
              No tags
            </span>
            <EventTag
              v-for="tag in event.tags"
              :key="tag.name"
              to-tag-page-on-click
              :name="tag.name"
              class="mr-3"
            />
            <v-btn
              x-small
              outlined
              color="primary"
              @click="isTagEditting = true"
            >
              Edit tags
            </v-btn>
          </template>
          <EventTagEditor
            v-else
            v-model="editedTags"
            :tags="tagNames"
            @tag-edit-start="onTagEditStart"
            @tag-edit-end="onTagEditEnd"
          />
        </div>
        <div class="text--secondary">
          <span v-if="event.group" class="mr-3">
            by
            <router-link :to="`/groups/${event.group.groupId}`">
              {{ event.group.name }}
            </router-link>
          </span>
          <div v-else>
            <v-icon small color="error" class="mb-1">mdi-alert-circle</v-icon>
            グループ不明
          </div>
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
            v-if="isTitechRoom(event.room.place)"
            :href="calcRoomPdfUrl(event.room.place)"
            target="_blank"
            rel="noreferer noopener"
            class="mr-3"
          >
            {{ event.room.place }}
          </a>
          <span v-else class="mr-3">{{ event.room.place }}</span>
        </div>
        <div v-if="event.room.verified" class="text--secondary body-2">
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
import { Component } from 'vue-property-decorator'
import ProgressCircular from '@/components/shared/ProgressCircular.vue'
import LoadFailedText from '@/components/shared/LoadFailedText.vue'
import EventTag from '@/components/shared/EventTag.vue'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import EventTagEditor from '@/components/event/EventTagEditor.vue'
import ActionMenu from '@/components/shared/ActionMenu.vue'
import { formatDate, DATETIME_DISPLAY_FORMAT } from '@/workers/date'
import { isTitechRoom, calcRoomPdfUrl } from '@/workers/TokyoTech'
import api, { ResponseEventDetail } from '@/api'

@Component({
  components: {
    ProgressCircular,
    LoadFailedText,
    EventTag,
    MarkdownField,
    EventTagEditor,
    ActionMenu,
  },
})
export default class EventDetail extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  isTagEditting = false

  event: ResponseEventDetail | null = null

  editedTags: string[] = []

  async created() {
    const eventID = this.$route.params.id
    this.status = 'loading'
    try {
      this.event = await api.events.getEventDetail({ eventID })
    } catch (__) {
      this.status = 'error'
      return
    }
    this.status = 'loaded'
  }

  get formatDate() {
    return formatDate(DATETIME_DISPLAY_FORMAT)
  }

  get sharedRoomString(): string {
    return this.event?.sharedRoom ? '部屋の共用可能' : '部屋の共用不可能'
  }

  get sharedRoomIcon() {
    return this.event?.sharedRoom
      ? { icon: 'mdi-door-open', color: 'success' }
      : { icon: 'mdi-door-closed-lock', color: 'error' }
  }

  get tagNames(): string[] {
    return this.event?.tags.map(({ name }) => name) ?? []
  }

  async onTagEditStart() {
    this.editedTags = this.event?.tags.map(({ name }) => name) ?? []
  }

  async onTagEditEnd() {
    const prevTagNames = this.event?.tags.map(({ name }) => name) ?? []
    const added = difference(this.editedTags, prevTagNames)
    const deleted = difference(prevTagNames, this.editedTags)
    const eventID = this.$route.params.id
    await Promise.all([
      ...added.map(name =>
        api.events.addEventTag({ eventID, requestTag: { name } })
      ),
      ...deleted.map(name =>
        api.events.deleteEventTag({ eventID, tagName: name })
      ),
    ])
    this.event = await api.events.getEventDetail({ eventID })
    this.isTagEditting = false
    this.editedTags = []
  }

  get isTitechRoom() {
    return isTitechRoom
  }

  get calcRoomPdfUrl() {
    return calcRoomPdfUrl
  }

  get isMyEvent(): boolean {
    return (
      this.event?.admins.includes(this.$store.direct.state.me?.userId ?? '') ??
      false
    )
  }
}

function difference<T>(xs: T[], ys: T[]): T[] {
  return xs.filter(x => !ys.includes(x))
}
</script>
