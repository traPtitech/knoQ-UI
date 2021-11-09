<template>
  <div>
    <summary-item>
      <summary-item-caption>New Event</summary-item-caption>
      <summary-item-main>{{ name }}</summary-item-main>
      <!-- <SummaryItemSubtext>
        <v-icon :color="openIcon.color">{{ openIcon.icon }}</v-icon>
        {{ openString }}
      </SummaryItemSubtext> -->
      <event-tag
        v-for="tag in tags"
        :key="tag.name"
        :name="tag.name"
        class="mr-3"
      />
    </summary-item>
    <summary-item>
      <summary-item-caption>Group</summary-item-caption>
      <summary-item-text>{{ groupName }}</summary-item-text>
    </summary-item>
    <summary-item>
      <summary-item-caption>Open</summary-item-caption>
      <summary-item-text>
        <v-icon :color="openIcon.color" large>{{ openIcon.icon }}</v-icon>
        <span class="text-h6 ml-2">{{ openString }}</span>
      </summary-item-text>
    </summary-item>
    <summary-item>
      <summary-item-caption>Date</summary-item-caption>
      <summary-item-text>
        {{ formatDate(timeStart) }}
        <v-icon>mdi-chevron-right</v-icon>
        {{ formatDate(timeEnd) }}
      </summary-item-text>
    </summary-item>
    <summary-item>
      <summary-item-caption>Place</summary-item-caption>
      <summary-item-text>
        <event-place :place="place" />
      </summary-item-text>
      <summary-item-subtext v-if="!isPrivate">
        <v-icon :color="sharedRoomIcon.color">{{ sharedRoomIcon.icon }}</v-icon>
        {{ sharedRoomString }}
      </summary-item-subtext>
    </summary-item>
    <summary-item>
      <summary-item-caption>Description</summary-item-caption>
      <div v-if="!description" class="text--secondary">説明はありません</div>
      <markdown-field v-else :src="description" />
    </summary-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import EventTag from '@/components/shared/EventTag.vue'
import SummaryItem from '@/components/shared/SummaryItem.vue'
import SummaryItemCaption from '@/components/shared/SummaryItemCaption.vue'
import SummaryItemMain from '@/components/shared/SummaryItemMain.vue'
import SummaryItemText from '@/components/shared/SummaryItemText.vue'
import SummaryItemSubtext from '@/components/shared/SummaryItemSubtext.vue'
import { formatDate, DATETIME_DISPLAY_FORMAT } from '@/workers/date'
import EventPlace from '@/components/event/EventPlace.vue'
export type EventSummary = {
  name: string
  description: string
  tags: { name: string }[]
  groupName: string
  open: boolean
  place: string
  isPrivate: boolean
  sharedRoom: boolean
  timeStart: string
  timeEnd: string
}

@Component({
  components: {
    MarkdownField,
    EventTag,
    SummaryItem,
    SummaryItemCaption,
    SummaryItemMain,
    SummaryItemText,
    SummaryItemSubtext,
    EventPlace,
  },
})
export default class EventFormSummary extends Vue {
  @Prop({ type: String, required: true })
  name!: string

  @Prop({ type: String, required: true })
  groupName!: string

  @Prop({ type: Boolean, required: true })
  open!: boolean

  @Prop({ type: Array, required: true })
  tags!: { name: string }[]

  @Prop({ type: String, required: true })
  description!: string

  @Prop({ type: Boolean, required: true })
  isPrivate!: boolean

  @Prop({ type: String, required: true })
  place!: string

  @Prop({ type: String, required: true })
  timeStart!: string

  @Prop({ type: String, required: true })
  timeEnd!: string

  @Prop({ type: Boolean, required: true })
  sharedRoom!: boolean

  get sharedRoomString(): string {
    return this.sharedRoom ? '部屋の共用可能' : '部屋の共用不可能'
  }

  get sharedRoomIcon() {
    return this.sharedRoom
      ? { icon: 'mdi-door-open', color: 'success' }
      : { icon: 'mdi-door-closed-lock', color: 'error' }
  }

  get openString(): string {
    return this.open
      ? 'グループ外の人も参加できます'
      : 'グループ外の人は参加できません'
  }

  get openIcon() {
    return this.open
      ? { icon: 'mdi-account-multiple-plus', color: 'success' }
      : { icon: 'mdi-account-multiple-remove', color: 'error' }
  }

  get formatDate() {
    return formatDate(DATETIME_DISPLAY_FORMAT)
  }
}
</script>
