<template>
  <v-container>
    <v-row align="center" justify-sm="space-between">
      <v-col class="mx-n1" sm="7" cols="12">
        <h1 class="mb-3 display-1 font-weight-bold">{{ title }}</h1>
        <EventTag v-for="(tag, i) in tags" :key="i" :name="tag" />
      </v-col>
      <v-col sm="3" cols="12">
        <v-btn>
          Join
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-img max-height="150" contain class="my-9" :src="img" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="2">
        Date
      </v-col>
      <v-col cols="12" sm="10">
        {{ formattedSpan }}
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="2">
        Place
      </v-col>
      <v-col cols="12" sm="10">
        {{ place }}
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="2">
        Group
      </v-col>
      <v-col cols="12" sm="10">
        {{ group }}
      </v-col>
    </v-row>
    <MarkdownField class="mt-10" :src="description" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import moment from 'moment'
import EventTag from '@/components/shared/EventTag.vue'
import MarkdownField from '@/components/shared/MarkdownField.vue'

@Component({
  components: {
    EventTag,
    MarkdownField,
  },
})
export default class EventDetail extends Vue {
  title = 'Vueもくもく会'

  tags = ['vue', 'ts', 'frontend']

  img =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K'

  description = [
    '## Vueもくもく会　開催決定!',
    '自分だけの最強のVueコンポーネントをつくろう!!',
    '- Vue初心者',
    '- Vue強者',
    '',
    '参加をお待ちしてます!!',
  ].join('\n')

  date = '2020-01-01'

  time_start = '17:00'
  time_end = '20:00'

  place = 'W933'

  group = 'SysAd'

  get formattedSpan(): string {
    const start = moment(`${this.date} ${this.time_start}`).format('lll')
    const end = moment(`${this.date} ${this.time_end}`).format('lll')
    return `${start} ~ ${end}`
  }
}
</script>
