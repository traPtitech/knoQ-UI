<template>
  <v-container>
    <autocomplete
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
    </autocomplete>
    <v-checkbox
      v-model="showFinished"
      label="過去のイベントも表示"
      class="mt-n6"
    />
    <ProgressCircular v-if="status === 'loading'" />
    <LoadFailed v-else-if="status === 'error'" />
    <EventList v-else :events="events" :event-filter="filterFn" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import EventList from '@/components/event/EventList.vue'
import EventTag from '@/components/shared/EventTag.vue'
import ProgressCircular from '@/components/shared/ProgressCircular.vue'
import LoadFailedText from '@/components/shared/LoadFailedText.vue'
import Autocomplete from '@/components/shared/Autocomplete.vue'
import { today, formatDate } from '@/workers/date'
import api, { ResponseEvent, ResponseTag } from '@/api'

@Component({
  components: {
    EventList,
    EventTag,
    ProgressCircular,
    LoadFailedText,
    Autocomplete,
  },
})
export default class EventSearch extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  filterTags: string[] = []
  showFinished = false

  events: ResponseEvent[] = []
  tags: ResponseTag[] = []

  async created() {
    this.status = 'loading'
    try {
      ;[this.events, this.tags] = await Promise.all([
        api.events.getEvents({}),
        api.tags.getTag(),
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
}
</script>
