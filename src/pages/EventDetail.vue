<template>
  <v-container>
    <v-card class="pa-9">
      <div class="mb-12">
        <h1 class="mb-1 display-1">{{ event.name }}</h1>
        <div class="mb-3">
          <template v-if="!isTagEditting">
            <EventTag
              v-for="(tag, i) in eventTags"
              :key="i"
              :name="tag"
              class="mr-3"
            />
            <v-btn x-small icon title="Edit tags" @click="isTagEditting = true">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <v-combobox
            v-else
            v-model="eventTags"
            :items="tags"
            autofocus
            dense
            chips
            clearable
            multiple
            solo
            @blur="onTagEditEnd"
          >
            <template #selection="{ item }">
              <EventTag close :name="item" @click:close="removeTag(item)" />
            </template>
          </v-combobox>
        </div>
        <div class="text--secondary">
          <span class="mr-3">by {{ group.name }}</span>
          <v-btn
            x-small
            outlined
            color="primary"
            :to="`/groups/${event.groupId}`"
          >
            Learn more
          </v-btn>
        </div>
      </div>
      <div class="mb-5">
        <div class="text--secondary mb-n1">Date</div>
        <div class="headline">
          {{ formattedTimeStart }}
          <v-icon>mdi-chevron-right</v-icon>
          {{ formattedTimeEnd }}
        </div>
      </div>
      <div class="mb-5">
        <div class="text--secondary mb-n1">Place</div>
        <div class="headline">{{ room.place }}</div>
        <div class="text--secondary body-2">
          <v-icon :color="sharedRoomIcon.color">
            {{ sharedRoomIcon.icon }}
          </v-icon>
          {{ sharedRoomString }}
        </div>
      </div>
      <div class="mb-5">
        <MarkdownField class="mt-10" :src="event.description" />
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import EventTag from '@/components/shared/EventTag.vue'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import { momentify } from '@/utils/date'

@Component({
  components: {
    EventTag,
    MarkdownField,
  },
})
export default class EventDetail extends Vue {
  isTagEditting = false
  tags = ['react', 'vue', 'ts', 'frontend', 'angular', 'haskell', 'monad']

  event = {
    eventId: 1,
    roomId: 1,
    groupId: 2,
    name: 'Vueもくもく会',
    tags: ['vue', 'ts', 'frontend'],
    description: [
      '## Vueもくもく会　開催決定!',
      '自分だけの最強のVueコンポーネントをつくろう!!',
      '- Vue初心者',
      '- Vue強者',
      '',
      '参加をお待ちしてます!!',
    ].join('\n'),
    timeStart: '17:00',
    timeEnd: '20:00',
    sharedRoom: true,
  }

  get eventTags(): string[] {
    return this.event.tags
  }
  set eventTags(value: string[]) {
    this.event.tags = value
  }

  room = {
    place: 'W933',
    date: '2020-01-01',
  }

  group = {
    name: 'SysAd',
  }

  removeTag(name: string) {
    const index = this.event.tags.indexOf(name)
    if (index >= 0) this.event.tags.splice(index, 1)
  }

  get formattedTimeStart(): string {
    return momentify(this.room.date, this.event.timeStart).format(
      'MMM D, h:mma'
    )
  }

  get formattedTimeEnd(): string {
    return momentify(this.room.date, this.event.timeEnd).format('MMM D, h:mma')
  }

  get sharedRoomString(): string {
    return this.event.sharedRoom ? '部屋の共用可能' : '部屋の共用不可能'
  }

  get sharedRoomIcon() {
    return this.event.sharedRoom
      ? { icon: 'mdi-door-open', color: 'success' }
      : { icon: 'mdi-door-closed-lock', color: 'error' }
  }

  onTagEditEnd() {
    this.isTagEditting = false
    alert(this.event.tags)
  }
}
</script>
