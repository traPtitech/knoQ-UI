<template>
  <div>
    <v-alert
      v-if="isInstant"
      border="left"
      prominent
      type="warning"
      variant="outlined"
    >
      traPが予約していない場所でイベントを開催しようとしています。そこでイベントを開催できるか確認してください。
    </v-alert>
    <v-alert
      v-if="isTrapGroup"
      border="left"
      prominent
      type="warning"
      variant="outlined"
    >
      traP部員全体が対象となるようなイベントを開催しようとしています。
    </v-alert>

    <SummaryItem>
      <SummaryItemCaption>New Event</SummaryItemCaption>
      <SummaryItemMain>
        {{ name }}
      </SummaryItemMain>
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
      <SummaryItemCaption>Open</SummaryItemCaption>
      <SummaryItemText>
        <v-icon :color="openIcon.color" large>{{ openIcon.icon }}</v-icon>
        <span class="text-h6 ml-2">{{ openString }}</span>
      </SummaryItemText>
      <v-alert
        v-if="!open && isEdit && openChanged()"
        border="left"
        colored-border
        type="warning"
        elevation="1"
        class="mt-3"
      >
        グループ外の参加者を許可しない場合、既に登録されているグループ外の参加者の参加情報は削除されます。
      </v-alert>
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
      <SummaryItemText>
        <event-place :place="place" />
      </SummaryItemText>
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
    <SummaryItem>
      <SummaryItemCaption>Invitees</SummaryItemCaption>
      <v-list>
        <div v-if="!invitees.length" class="text--secondary">
          参加予定者はいません
        </div>
        <v-list-item v-for="target in inviteesSlice" :key="target.userId">
          <v-list-item-avatar>
            <user-avatar
              size="36"
              :user-id="target.name"
              :user-icon="target.icon"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            {{ target.name }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-pagination
        v-model="page"
        :length="Math.ceil(invitees.length / inviteesPerPage)"
      />
    </SummaryItem>
  </div>
</template>

<script lang="ts">
import { ResponseUser } from '@/api'
import { EventInputContent } from '@/components/event/EventFormContent.vue'
import EventPlace from '@/components/event/EventPlace.vue'
import EventTag from '@/components/shared/EventTag.vue'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import SummaryItem from '@/components/shared/SummaryItem.vue'
import SummaryItemCaption from '@/components/shared/SummaryItemCaption.vue'
import SummaryItemMain from '@/components/shared/SummaryItemMain.vue'
import SummaryItemSubtext from '@/components/shared/SummaryItemSubtext.vue'
import SummaryItemText from '@/components/shared/SummaryItemText.vue'
import { DATETIME_DISPLAY_FORMAT, formatDate } from '@/workers/date'
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
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
  isInstant?: boolean
  isTrapGroup?: boolean
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
  @Prop({ type: Object, required: true })
  content!: EventInputContent

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

  @Prop({ type: Boolean, required: true })
  isEdit!: boolean

  @Prop({ type: Boolean, required: true })
  isInstant!: boolean

  @Prop({ type: Boolean, required: true })
  isTrapGroup!: boolean

  page: number = 1
  inviteesPerPage: number = 6
  originalOpen: boolean = null!

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

  get invitees(): ResponseUser[] {
    const userById = this.$store.direct.getters.usersCache.userById
    if (!this.content.group) return []
    let invitees = this.content.group.members.flatMap(userId => {
      const user = userById(userId)
      return user ? user : []
    })
    return invitees
  }

  get inviteesSlice(): ResponseUser[] {
    return this.invitees.slice(
      (this.page - 1) * this.inviteesPerPage,
      this.page * this.inviteesPerPage
    )
  }

  openChanged(): boolean {
    return this.originalOpen !== this.open
  }

  created() {
    this.originalOpen = this.open
  }
}
</script>
