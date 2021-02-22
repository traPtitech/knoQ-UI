<template>
  <div>
    <SummaryItem>
      <SummaryItemCaption>New Group</SummaryItemCaption>
      <SummaryItemMain>{{ name }}</SummaryItemMain>
      <SummaryItemSubtext>
        <v-icon :color="openIcon.color">{{ openIcon.icon }}</v-icon>
        {{ openString }}
      </SummaryItemSubtext>
    </SummaryItem>
    <SummaryItem>
      <SummaryItemCaption>Members</SummaryItemCaption>
      <TrapAvatar
        v-for="name in memberNames"
        :key="name"
        :traq-id="name"
        size="36"
        class="mr-2"
      />
    </SummaryItem>
    <SummaryItem>
      <SummaryItemCaption>Description</SummaryItemCaption>
      <MarkdownField :src="description" />
    </SummaryItem>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import TrapAvatar from '@/components/shared/TrapAvatar.vue'
import SummaryItem from '@/components/shared/SummaryItem.vue'
import SummaryItemCaption from '@/components/shared/SummaryItemCaption.vue'
import SummaryItemMain from '@/components/shared/SummaryItemMain.vue'
import SummaryItemSubtext from '@/components/shared/SummaryItemSubtext.vue'

export type GroupFormSummaryProps = {
  name: string
  description: string
  members: string[]
  open: boolean
}

@Component({
  components: {
    MarkdownField,
    TrapAvatar,
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

  get memberNames(): string[] {
    const nameById = this.$store.direct.getters.usersCache.nameById
    return this.members.flatMap(userId => nameById(userId) ?? [])
  }

  get openIcon() {
    return this.open
      ? { icon: 'mdi-account-multiple-plus', color: 'success' }
      : { icon: 'mdi-account-multiple-remove', color: 'error' }
  }
}
</script>
