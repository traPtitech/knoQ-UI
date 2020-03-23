<template>
  <div>
    <div class="mb-7">
      <div class="text--secondary">New Event</div>
      <div class="display-1 mb-1">{{ name }}</div>
      <EventTag v-for="tag in tags" :key="tag" :name="tag" class="mr-1" />
    </div>
    <div class="mb-7">
      <div class="text--secondary">Group</div>
      <div class="headline">{{ group }}</div>
    </div>
    <div class="mb-7">
      <div class="text--secondary">Date Time</div>
      <div class="headline">
        {{ date }}: {{ timeStart }}
        <v-icon>mdi-chevron-right</v-icon>
        {{ timeEnd }}
      </div>
    </div>
    <div class="mb-7">
      <div class="text--secondary">Place</div>
      <div class="headline mb-1">{{ place }}</div>
      <div v-if="!isPrivate">
        <v-icon :color="sharedRoomIcon.color" class="mr-2">
          {{ sharedRoomIcon.icon }}
        </v-icon>
        <span class="text--secondary body-2">{{ sharedRoomString }}</span>
      </div>
    </div>
    <div class="mb-7">
      <div class="text--secondary">Description</div>
      <MarkdownField :src="description" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import EventTag from '@/components/shared/EventTag.vue'

@Component({
  components: {
    MarkdownField,
    EventTag,
  },
})
export default class EventFormSummary extends Vue {
  @Prop() name: string
  @Prop() group: string
  @Prop() tags: string[]
  @Prop() description: string
  @Prop() isPrivate: boolean
  @Prop() place: string
  @Prop() date: string
  @Prop() timeStart: string
  @Prop() timeEnd: string
  @Prop() sharedRoom: boolean

  get sharedRoomString(): string {
    return this.sharedRoom ? '部屋の共用可能' : '部屋の共用不可能'
  }

  get sharedRoomIcon() {
    return this.sharedRoom
      ? { icon: 'mdi-door-open', color: 'success' }
      : { icon: 'mdi-door-closed-lock', color: 'error' }
  }
}
</script>
