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
      <SummaryItemText>{{ group && group.name }}</SummaryItemText>
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
        <v-icon :color="sharedRoomIcon.color">
          {{ sharedRoomIcon.icon }}
        </v-icon>
        {{ sharedRoomString }}
      </SummaryItemSubtext>
    </SummaryItem>
    <SummaryItem>
      <SummaryItemCaption>Description</SummaryItemCaption>
      <div v-if="!description" class="text--secondary">
        説明はありません
      </div>
      <MarkdownField v-else :src="description" />
    </SummaryItem>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import 'reflect-metadata'
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
  @Prop({ required: true }) name!: string
  @Prop({ required: true }) group!: Schemas.Group | null
  @Prop({ required: true }) tags!: { name: string }[]
  @Prop({ required: true }) description!: string
  @Prop({ required: true }) isPrivate!: boolean
  @Prop({ required: true }) place!: string
  @Prop({ required: true }) timeStart!: string
  @Prop({ required: true }) timeEnd!: string
  @Prop({ required: true }) sharedRoom!: boolean

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
