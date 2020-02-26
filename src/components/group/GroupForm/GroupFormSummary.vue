<template>
  <div>
    <div class="mb-5">
      <div class="font-weight-medium">
        name
      </div>
      <div>
        {{ name }}
      </div>
    </div>
    <div class="mb-5">
      <div class="font-weight-medium">
        joinFreely
      </div>
      <div>
        {{ joinFreely }}
      </div>
    </div>
    <div class="mb-3">
      <div class="font-weight-medium mb-n3">
        members
      </div>
      <v-list>
        <v-list-item-avatar
          v-for="member in members"
          :key="member"
          class="ml-0 mr-1"
        >
          <Avatar size="32" :traq-id="member" />
        </v-list-item-avatar>
      </v-list>
    </div>
    <template v-if="description">
      <div class="font-weight-medium">
        description
      </div>
      <v-card flat color="grey lighten-4" class="px-5 py-3 mb-5">
        <MarkdownField :src="description" />
      </v-card>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import Avatar from '@/components/shared/Avatar.vue'
import { render } from '@/utils/markdown-it'

@Component({
  components: {
    MarkdownField,
    Avatar,
  },
})
export default class GroupEventFormSummary extends Vue {
  @Prop()
  name: string

  @Prop()
  description: string

  @Prop()
  members: string[]

  @Prop()
  joinFreely: boolean

  private get renderedDescription(): string {
    return render(this.description)
  }
}
</script>
