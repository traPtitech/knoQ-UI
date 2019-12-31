<template>
  <v-card flat class="px-6" color="grey lighten-4" @click="onClick">
    <v-row align="center" justify="space-between">
      <v-col cols="2">
        <div class="mb-4">
          {{ timeStart }}
        </div>
        <div>
          {{ timeEnd }}
        </div>
      </v-col>
      <v-col>
        <span class="title">{{ title }}</span>
      </v-col>
      <v-col cols="2">
        {{ place }}
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class EventTape extends Vue {
  @Prop()
  id: number

  @Prop()
  title: string

  @Prop()
  timeStart: string

  @Prop()
  timeEnd: string

  @Prop()
  place: string

  onClick() {
    this.$router.push(`/events/${this.id}`)
  }
}
</script>
