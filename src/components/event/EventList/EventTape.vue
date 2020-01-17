<template>
  <v-card flat class="px-3 px-md-6" color="grey lighten-4" @click="onClick">
    <v-row align="center">
      <v-col cols="2" style="min-width: 4em">
        <div class="mb-4">
          {{ timeStart }}
        </div>
        <div>
          {{ timeEnd }}
        </div>
      </v-col>
      <v-col class="text-truncate">
        <span class="title">{{ title }}</span>
      </v-col>
      <v-col cols="2" style="min-width: 5em">
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
