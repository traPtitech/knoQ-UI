<template>
  <v-form v-model="valid">
    <v-text-field
      v-model="_name"
      filled
      label="name"
      :rules="$rules.eventName"
      class="mb-2"
    />
    <div class="d-flex">
      <v-autocomplete
        v-model="_group"
        filled
        label="group"
        :items="groupList"
        :rules="$rules.eventGroup"
        class="flex-grow-1"
      />
      <v-btn to="/groups/new" depressed rounded class="mt-3 ml-3 flex-grow-0">
        Create new group
      </v-btn>
    </div>
    <v-combobox
      v-model="_tags"
      filled
      multiple
      label="tags"
      placeholder="Select tags or add new one"
      :items="tagList"
      class="mb-2"
    >
      <template #selection="data">
        <Tag :key="data.item" :name="data.item" class="mt-3" />
      </template>
    </v-combobox>
    <v-textarea
      v-model="_description"
      filled
      rows="15"
      no-resize
      label="description"
      :placeholder="'# You can write markdown here'"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, PropSync } from 'vue-property-decorator'
import Tag from '@/components/shared/Tag.vue'

@Component({
  components: {
    Tag,
  },
})
export default class EventContentForm extends Vue {
  @Prop() value: boolean
  @PropSync('name') _name: string
  @PropSync('group') _group: string
  @PropSync('tags') _tags: string[]
  @PropSync('description') _description: string

  groupList = Array.from({ length: 5 }, (v, i) => `group${i}`)
  tagList = Array.from({ length: 5 }, (_, i) => `tag${i}`)

  private get valid(): boolean {
    return this.value
  }
  private set valid(value: boolean) {
    this.$emit('input', value)
  }
}
</script>
