<template>
  <v-form v-model="valid">
    <div class="mb-4 text--secondary caption">
      <span class="mr-1">
        ※イベントを作るには主催するグループが必要です
      </span>
      <router-link to="/groups/new">
        新しくグループを作る
      </router-link>
    </div>
    <v-text-field
      v-model="nameSync"
      outlined
      label="イベント名"
      :placeholder="'\t'"
      :rules="$rules.eventName"
    />
    <v-autocomplete
      v-model="groupSync"
      outlined
      label="主催グループ"
      :placeholder="'\t'"
      :items="allGroups"
      item-text="name"
      :item-value="v => v"
      :rules="$rules.eventGroup"
    />
    <v-combobox
      v-model="tagNames"
      outlined
      multiple
      clearable
      label="タグ"
      placeholder="Select or create one"
      :items="allTags"
    >
      <template #selection="{ item }">
        <EventTag
          :key="item"
          :name="item"
          close
          class="mt-3"
          @click:close="removeTag(item)"
        />
      </template>
    </v-combobox>
    <v-textarea
      v-model="descriptionSync"
      outlined
      rows="25"
      no-resize
      label="説明"
      placeholder="# You can write Markdown here"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import 'reflect-metadata'
import { Component, Prop, PropSync } from 'vue-property-decorator'
import EventTag from '@/components/shared/EventTag.vue'
import { rmCtrlChar } from '@/workers/rmCtrlChar'
import RepositoryFactory from '@/repositories/RepositoryFactory'

const GroupsRepo = RepositoryFactory.get('groups')
const UsersRepo = RepositoryFactory.get('users')
const TagsRepo = RepositoryFactory.get('tags')

@Component({
  components: {
    EventTag,
  },
})
export default class EventFormContent extends Vue {
  @Prop({ required: true }) value!: boolean
  @PropSync('name', { required: true }) nameSync!: string
  @PropSync('group', { required: true }) groupSync!: Schemas.Group | null
  @PropSync('tags', { required: true }) tagsSync!: { name: string }[]
  @PropSync('description', { required: true }) descriptionSync!: string

  allGroups: Schemas.Group[] = []
  allTags: string[] = []

  created() {
    Promise.all([this.fetchGroups(), this.fetchTags()])
  }
  async fetchGroups() {
    const [{ data: groups }, { data: groupIds }] = await Promise.all([
      GroupsRepo.get(),
      UsersRepo.me.groups.get(),
    ])
    this.allGroups = groups.filter(group => groupIds.includes(group.groupId))
  }
  async fetchTags() {
    this.allTags = (await TagsRepo.get()).data.map(({ name }) => name)
  }

  removeTag(tag1: string) {
    this.tagNames = this.tagNames.filter(tag2 => tag1 !== tag2)
  }

  private get valid(): boolean {
    return this.value
  }
  private set valid(value: boolean) {
    this.$emit('input', value)
  }

  private get tagNames(): string[] {
    return this.tagsSync.map(tag => tag.name)
  }
  private set tagNames(tags: string[]) {
    this.tagsSync = tags
      .map(rmCtrlChar)
      .filter(name => !!name)
      .map(name => ({ name }))
  }
}
</script>
