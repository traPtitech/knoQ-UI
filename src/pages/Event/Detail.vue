<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="8">
        <v-card tile elevation="7" class="py-11 px-12 mb-3">
          <v-row class="px-3">
            <h1 class="mb-3">Reactもくもく会</h1>
          </v-row>
          <v-row>
            <Tag v-for="(tag, i) in tags" :key="i" :name="tag" />
          </v-row>
          <v-row>
            <v-img
              max-height="150"
              contain
              class="my-9"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K"
            />
          </v-row>
          <v-row>
            <v-col cols="12" sm="2">
              Date
            </v-col>
            <v-col cols="12" sm="10">
              2019-11-15 Fri 17:00 ~ 20:00
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="2">
              Place
            </v-col>
            <v-col cols="12" sm="10">
              W933
            </v-col>
          </v-row>
        </v-card>
        <v-card tile elevation="7" class="py-7 px-12">
          <div class="mb-5">Description</div>
          Reactを題材としてもくもく会を開催します！
          <ul>
            <li>React Hooks</li>
            <li>React Native</li>
          </ul>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-card tile elevation="7">
          <v-row align="center" class="px-9 py-5">
            <v-col cols="3">
              <v-avatar color="orange" size="62">SA</v-avatar>
            </v-col>
            <v-col>
              SysAd
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-btn class="mb-8">
              Join
            </v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import Tag from '@/components/Molecules/Tag.vue'

@Component({
  components: {
    Tag,
  },
})
export default class EventDetail extends Vue {
  tags: string[] = ['react', 'ts', 'frontend']
}
</script>
