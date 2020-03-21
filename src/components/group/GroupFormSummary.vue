<template>
  <div>
    <div class="mb-7">
      <div class="text--secondary">Group</div>
      <div class="display-1 mb-1">{{ name }}</div>
      <div>
        <v-icon :color="openIcon.color" class="mr-3">
          {{ openIcon.icon }}
        </v-icon>
        <span class="text--secondary body-2">{{ openString }}</span>
      </div>
    </div>
    <div class="mb-7">
      <div class="text--secondary">Members</div>
      <TrapAvatar
        v-for="member in members"
        :key="member"
        :traq-id="member"
        size="36"
        class="mr-2"
      />
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
import TrapAvatar from '@/components/shared/TrapAvatar.vue'
import { render } from '@/utils/markdown-it'

@Component({
  components: {
    MarkdownField,
    TrapAvatar,
  },
})
export default class GroupEventFormSummary extends Vue {
  @Prop() name: string
  @Prop() description: string
  @Prop() members: string[]
  @Prop() open: boolean

  get renderedDescription(): string {
    return render(this.description)
  }

  get openString(): string {
    return this.open
      ? '自由参加可能なグループです'
      : '自由参加できないグループです'
  }

  get openIcon() {
    return this.open
      ? { icon: 'mdi-account-multiple-plus', color: 'success' }
      : { icon: 'mdi-account-multiple-remove', color: 'error' }
  }
}
</script>
