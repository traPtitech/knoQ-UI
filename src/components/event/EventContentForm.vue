<template>
  <v-form v-model="valid">
    <v-text-field
      filled
      label="name"
      v-model="_name"
      :rules="eventNameRules"
      class="mb-2"
    />
    <div class="d-flex">
      <v-autocomplete
        filled
        label="group"
        v-model="_group"
        :items="groupList"
        :rules="eventGroupRules"
        class="flex-grow-1"
      />
      <v-btn
        depressed
        rounded
        class="mt-3 ml-3 flex-grow-0"
        @click="goToGroupNewPage()"
      >
        Create new group
      </v-btn>
    </div>
    <v-combobox
      filled
      multiple
      label="tags"
      placeholder="Select tags or add new one"
      v-model="_tags"
      :items="tagList"
      class="mb-2"
    />
    <v-textarea
      filled
      rows="15"
      no-resize
      v-model="_description"
      label="description"
      :placeholder="'# You can write markdown here'"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import Rules from '@/utils/rules'

@Component
export default class EventContentForm extends Vue {
  @Prop()
  value: boolean

  @Prop()
  name: string

  @Prop()
  group: string

  @Prop()
  tags: string[]

  @Prop()
  description: string

  groupList = Array.from({ length: 5 }, (v, i) => `group${i}`)
  tagList = Array.from({ length: 5 }, (_, i) => `tag${i}`)

  goToGroupNewPage() {
    this.$router.push({ path: '/groups/new' })
  }

  private get valid(): boolean {
    return this.value
  }

  private set valid(value: boolean) {
    this.$emit('input', value)
  }

  private get _name(): string {
    return this.name
  }

  private set _name(value: string) {
    this.$emit('update:name', value)
  }

  private get _group(): string {
    return this.group
  }

  private set _group(value: string) {
    this.$emit('update:group', value)
  }

  private get _tags(): string[] {
    return this.tags
  }

  private set _tags(value: string[]) {
    this.$emit('update:tags', value)
  }

  private get _description(): string {
    return this.description
  }

  private set _description(value: string) {
    this.$emit('update:description', value)
  }

  eventNameRules = Rules.eventName
  eventGroupRules = Rules.eventGroup
}
</script>
