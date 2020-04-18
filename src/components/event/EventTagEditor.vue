<template>
  <v-combobox
    v-model="editedTags"
    :items="tags"
    autofocus
    dense
    outlined
    chips
    clearable
    multiple
    @focus="$emit('tag-edit-start')"
    @blur="$emit('tag-edit-end')"
  >
    <template #selection="{ item }">
      <EventTag close :name="item" @click:close="removeTag(item)" />
    </template>
  </v-combobox>
</template>

<script lang="ts">
import Vue from 'vue'
import 'reflect-metadata'
import { Component, Prop } from 'vue-property-decorator'
import EventTag from '@/components/shared/EventTag.vue'

@Component({
  components: {
    EventTag,
  },
})
export default class EventTagEditor extends Vue {
  @Prop({ required: true }) value!: string[]
  @Prop({ required: true }) tags!: string[] | null

  removeTag(tag1: string) {
    this.editedTags = this.editedTags.filter(tag2 => tag1 !== tag2)
  }

  get editedTags(): string[] {
    return this.value
  }
  set editedTags(tags: string[]) {
    this.$emit('input', tags)
  }
}
</script>
