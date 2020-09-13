<template>
  <div>
    <SummaryItem>
      <SummaryItemCaption>New Event</SummaryItemCaption>
      <SummaryItemMain>{{ name }}</SummaryItemMain>
      <EventTag
        v-for="tag in tags"
        :key="tag.name"
        :name="tag.name"
        class="mr-3"
      />
    </SummaryItem>
    <SummaryItem>
      <SummaryItemCaption>Group</SummaryItemCaption>
      <SummaryItemText>{{ groupName }}</SummaryItemText>
    </SummaryItem>
    <SummaryItem>
      <SummaryItemCaption>Date</SummaryItemCaption>
      <SummaryItemText>
        {{ formatDate(timeStart) }}
        <v-icon>mdi-chevron-right</v-icon>
        {{ formatDate(timeEnd) }}
      </SummaryItemText>
    </SummaryItem>
    <SummaryItem>
      <SummaryItemCaption>Place</SummaryItemCaption>
      <SummaryItemText>{{ place }}</SummaryItemText>
      <SummaryItemSubtext v-if="!isPrivate">
        <v-icon :color="sharedRoomIcon.color">{{ sharedRoomIcon.icon }}</v-icon>
        {{ sharedRoomString }}
      </SummaryItemSubtext>
    </SummaryItem>
    <SummaryItem>
      <SummaryItemCaption>Description</SummaryItemCaption>
      <div v-if="!description" class="text--secondary">説明はありません</div>
      <MarkdownField v-else :src="description" />
    </SummaryItem>
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

@Component({
  components: {
    MarkdownField,
    EventTag,
    SummaryItem,
    SummaryItemCaption,
    SummaryItemMain,
    SummaryItemText,
    SummaryItemSubtext,
  },
})
export default class EventFormSummary extends Vue {
  @Prop({ type: String, required: true })
  name!: string

  @Prop({ type: String, required: true })
  groupName!: string

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

  get formatDate() {
    return formatDate(DATETIME_DISPLAY_FORMAT)
  }
}
</script>
