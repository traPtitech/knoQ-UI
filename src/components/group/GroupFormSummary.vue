<template>
  <div>
    <summary-item>
      <summary-item-caption>New Group</summary-item-caption>
      <summary-item-main>{{ name }}</summary-item-main>
      <summary-item-subtext>
        <v-icon :color="openIcon.color">{{ openIcon.icon }}</v-icon>
        {{ openString }}
      </summary-item-subtext>
    </summary-item>
    <summary-item>
      <summary-item-caption>Members</summary-item-caption>
      <user-avatar
        v-for="member in getMembers"
        :key="member.name"
        :user-id="member.name"
        :user-icon="member.icon"
        size="36"
        class="mr-2"
      />
    </summary-item>
    <summary-item>
      <summary-item-caption>Description</summary-item-caption>
      <markdown-field :src="description" />
    </summary-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import SummaryItem from '@/components/shared/SummaryItem.vue'
import SummaryItemCaption from '@/components/shared/SummaryItemCaption.vue'
import SummaryItemMain from '@/components/shared/SummaryItemMain.vue'
import SummaryItemSubtext from '@/components/shared/SummaryItemSubtext.vue'
import { ResponseUser } from '@/api'

export type GroupFormSummaryProps = {
  name: string
  description: string
  members: string[]
  open: boolean
}

@Component({
  components: {
    MarkdownField,
    UserAvatar,
    SummaryItem,
    SummaryItemCaption,
    SummaryItemMain,
    SummaryItemSubtext,
  },
})
export default class GroupFormSummary extends Vue {
  @Prop({ type: String, required: true })
  name!: string

  @Prop({ type: String, required: true })
  description!: string

  @Prop({ type: Array, required: true })
  members!: string[]

  @Prop({ type: Boolean, required: true })
  open!: boolean

  get openString(): string {
    return this.open
      ? '自由参加可能なグループです'
      : '自由参加できないグループです'
  }

  //   get memberNames(): string[] {
  //     const nameById = this.$store.direct.getters.usersCache.nameById
  //     return this.members.flatMap(userId => nameById(userId) ?? [])
  //   }

  get getMembers(): ResponseUser[] {
    const userById = this.$store.direct.getters.usersCache.userById
    return this.members.flatMap(userID => userById(userID) ?? [])
  }

  get openIcon() {
    return this.open
      ? { icon: 'mdi-account-multiple-plus', color: 'success' }
      : { icon: 'mdi-account-multiple-remove', color: 'error' }
  }
}
</script>
