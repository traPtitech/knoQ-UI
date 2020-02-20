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
    >
      <template v-slot:selection="data">
        <Tag :key="data.item" :name="data.item" class="mt-3" />
      </template>
    </v-combobox>
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
import { Component, Prop, PropSync } from 'vue-property-decorator'
import Tag from '@/components/shared/Tag.vue'
import Rules from '@/utils/rules'

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

  goToGroupNewPage() {
    this.$router.push({ path: '/groups/new' })
  }

  private get valid(): boolean {
    return this.value
  }
  private set valid(value: boolean) {
    this.$emit('input', value)
  }

  eventNameRules = Rules.eventName
  eventGroupRules = Rules.eventGroup
}
</script>
