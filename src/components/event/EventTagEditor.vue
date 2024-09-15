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
    @focus="emit('tagEditStart')"
    @blur="emit('tagEditEnd')"
  >
    <template #selection="{ item }">
      <EventTag close :name="item" @click:close="removeTag(item)" />
    </template>
  </v-combobox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EventTag from '@/components/shared/EventTag.vue'

const props = defineProps<{
  value: string[]
  tags: string[] | null
}>()

const emit = defineEmits<{
  (e: 'input', v: string[]): void
  (e: 'tagEditStart'): void
  (e: 'tagEditEnd'): void
}>()

const editedTags = computed({
  get: () => props.value,
  set: v => emit('input', v),
})

const removeTag = (tag1: string) => {
  editedTags.value = editedTags.value.filter(tag2 => tag1 !== tag2)
}
</script>
