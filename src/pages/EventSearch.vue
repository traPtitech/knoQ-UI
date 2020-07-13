<template>
  <v-container>
    <v-autocomplete
      v-model="filterTags"
      :items="tags"
      item-text="name"
      placeholder="Filter by tags"
      chips
      clearable
      multiple
      solo
      prepend-inner-icon="mdi-filter"
    >
      <template #selection="{ item }">
        <EventTag
          close
          :name="item.name"
          @click:close="removeFilterTag(item.name)"
        />
      </template>
    </v-autocomplete>
    <v-checkbox
      v-model="showFinished"
      label="過去のイベントも表示"
      class="mt-n6"
    />
    <ProgressCircular v-if="status === 'loading'" />
    <LoadFailed v-else-if="status === 'error'" />
    <EventList v-else :events="allEventData" :event-filter="filterFn" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import EventList from '@/components/event/EventList.vue'
import EventTag from '@/components/shared/EventTag.vue'
import ProgressCircular from '@/components/shared/ProgressCircular.vue'
import LoadFailedText from '@/components/shared/LoadFailedText.vue'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import { today, formatDate } from '@/workers/date'

const EventsRepo = RepositoryFactory.get('events')
const RoomsRepo = RepositoryFactory.get('rooms')
const TagsRepo = RepositoryFactory.get('tags')

@Component({
  components: {
    EventList,
    EventTag,
    ProgressCircular,
    LoadFailedText,
  },
})
export default class EventSearch extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  filterTags: string[] = []
  showFinished = false

  events: Schemas.Event[] | null = null
  rooms: Map<string, Schemas.Room> | null = null
  tags: Schemas.Tag[] | null = null

  async created() {
    this.status = 'loading'
    try {
      await Promise.all([
        this.fetchEvents(),
        this.fetchRooms(),
        this.fetchTags(),
      ])
      this.status = 'loaded'
      this.filterTags = [this.$route.query.tags]
        .flat()
        .filter((v): v is string => !!v)
      this.showFinished = [this.$route.query.showFinished].flat()[0] === '1'
    } catch (__) {
      this.status = 'error'
    }
  }
  async fetchEvents() {
    this.events = (await EventsRepo.get()).data
  }
  async fetchRooms() {
    const rooms = new Map<string, Schemas.Room>()
    const { data } = await RoomsRepo.get()
    data.forEach(room => rooms.set(room.roomId, room))
    this.rooms = rooms
  }
  async fetchTags() {
    this.tags = (await TagsRepo.get()).data
  }

  @Watch('showFinished')
  @Watch('filterTags')
  onChangeSearchQuery() {
    this.$router
      .push({
        path: '/events',
        query: {
          showFinished: this.showFinished ? '1' : '0',
          tags: this.filterTags,
        },
      })
      .catch(() => {})
  }

  get filterFn() {
    return (e: Schemas.Event) => {
      const isFinished = formatDate()(e.timeEnd) < today()
      const hasTags = this.filterTags.every(t =>
        e.tags.some(({ name }) => name === t)
      )
      return (this.showFinished || !isFinished) && hasTags
    }
  }

  removeFilterTag(name: string) {
    const index = this.filterTags.indexOf(name)
    if (index >= 0) this.filterTags.splice(index, 1)
  }

  get allEventData() {
    if (!this.events || !this.rooms) return []
    return [...this.events]
      .sort((e1, e2) => (e1.timeStart < e2.timeStart ? -1 : 1))
      .map(event => ({ ...event, place: this.rooms?.get(event.roomId)?.place }))
  }
}
</script>
