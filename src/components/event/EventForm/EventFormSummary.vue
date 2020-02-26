<template>
  <div>
    <div class="mb-5">
      <div class="font-weight-medium">name</div>
      <div>{{ name }}</div>
    </div>
    <div class="mb-5">
      <div class="font-weight-medium">group</div>
      <div>{{ group }}</div>
    </div>
    <div class="mb-5">
      <div class="font-weight-medium">room</div>
      <div>{{ room }}</div>
    </div>
    <div class="mb-5">
      <div class="font-weight-medium mb-1">tags</div>
      <div v-if="tags.length === 0">none</div>
      <Tag v-for="tag in tags" v-else :key="tag" :name="tag" class="mr-3" />
    </div>
    <div class="mb-5">
      <div class="font-weight-medium">description</div>
      <v-card
        v-if="description"
        flat
        color="grey lighten-4"
        class="px-5 py-3 mb-5"
      >
        <MarkdownField :src="description" />
      </v-card>
      <div v-else>none</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import Tag from '@/components/shared/Tag.vue'

@Component({
  components: {
    MarkdownField,
    Tag,
  },
})
export default class EventFormSummary extends Vue {
  @Prop()
  name: string

  @Prop()
  group: string

  @Prop()
  tags: string[]

  @Prop()
  room: string

  @Prop()
  description: string
}
</script>
