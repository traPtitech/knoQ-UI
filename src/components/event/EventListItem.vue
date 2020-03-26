<template>
  <v-card elevation="4" style="width: 100%;" class="px-3 py-1">
    <v-card-title class="headline">{{ title }}</v-card-title>
    <v-card-subtitle>
      {{ place }}: {{ timeStart }}
      <v-icon small style="margin-bottom: 3px;">mdi-chevron-right</v-icon>
      {{ timeEnd }}
    </v-card-subtitle>
    <v-card-text class="text-truncate">{{ description }}</v-card-text>
    <v-card-actions class="px-4">
      <v-row dense>
        <v-col lg="" cols="12">
          <EventTag v-for="tag in tags" :key="tag" :name="tag" class="mr-3" />
        </v-col>
        <v-col lg="" cols="12" class="flex-grow-0">
          <v-btn depressed color="primary" :to="`/events/${id}`">
            LEARN MORE
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import TrapAvatar from '@/components/shared/TrapAvatar.vue'
import EventTag from '@/components/shared/EventTag.vue'

@Component({
  components: {
    TrapAvatar,
    EventTag,
  },
})
export default class EventListItem extends Vue {
  @Prop() id: number
  @Prop() title: string
  @Prop() timeStart: string
  @Prop() timeEnd: string
  @Prop() place: string
  @Prop() description: string
  @Prop() tags: string[]
}
</script>
