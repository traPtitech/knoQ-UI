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
    } catch (__) {
      this.status = 'error'
    }
  }

  get filterTags(): string[] {
    return [this.$route.query.tags].flat().filter((v): v is string => !!v)
  }
  set filterTags(tags: string[]) {
    this.setSearchQueryToUrl(tags, this.showFinished)
  }

  get showFinished(): boolean {
    return [this.$route.query.showFinished].flat()[0] === '1'
  }
  set showFinished(b: boolean) {
    this.setSearchQueryToUrl(this.filterTags, b)
  }

  setSearchQueryToUrl(tags: string[], showFinished: boolean) {
    this.$router
      .push({
        path: '/events',
        query: {
          showFinished: showFinished ? '1' : '0',
          tags,
        },
      })
      .catch(() => {})
  }

  get filterFn() {
    return (e: ResponseEvent) => {
      const isFinished = formatDate()(e.timeEnd) < today()
      const hasTags = this.filterTags.every(t =>
        e.tags.some(({ name }) => name === t)
      )
      return (this.showFinished || !isFinished) && hasTags
    }
  }

  removeFilterTag(name: string) {
    const index = this.filterTags.indexOf(name)
    if (index >= 0) {
      this.filterTags = [
        ...this.filterTags.slice(0, index),
        ...this.filterTags.slice(index + 1),
      ]
    }
  }
}
</script>
