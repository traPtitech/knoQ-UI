<template>
  <v-col>
    <v-checkbox v-model="showFinished" label="過去のイベントも表示" class="" />
    <calendar :height="784" :events="events" />
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import Calendar from '@/components/shared/Calendar.vue'
import api, { ResponseEvent } from '@/api'

@Component({
  components: {
    Calendar,
  },
})
export default class CalendarPage extends Vue {
  events: ResponseEvent[] = []

  get showFinished(): boolean {
    return [this.$route.query.showFinished].flat()[0] === '1'
  }
  set showFinished(b: boolean) {
    this.setSearchQueryToUrl(b)
  }

  setSearchQueryToUrl(showFinished: boolean) {
    this.$router
      .push({
        path: '/calendar',
        query: {
          showFinished: showFinished ? '1' : '0',
        },
      })
      .catch(() => {})
  }

  @Watch('showFinished')
  async onShowFinishedChanged() {
    await this.fetchEvents()
  }

  async created() {
    await this.fetchEvents()
  }

  async fetchEvents() {
    const dataBegin = !this.showFinished
      ? `${new Date().toISOString().split('T')[0]}T00:00:00+09:00`
      : '2006-01-01T00:00:00+09:00'
    this.events = await api.events.getEvents({
      dateBegin: dataBegin,
    })
  }
}
</script>
