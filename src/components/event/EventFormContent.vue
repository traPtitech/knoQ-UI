<template>
  <v-form v-model="valid">
    <div class="mb-3">
      <span class="text--secondary caption">
        ※イベントを作るには主催するグループが必要です
      </span>
      <v-btn small text color="primary" to="/groups/new" class="mb-1">
        新しくグループを作る
      </v-btn>
    </div>
    <v-text-field
      v-model="nameSync"
      outlined
      label="イベント名"
      placeholder="Some event"
      :rules="$rules.eventName"
    />
    <v-autocomplete
      v-model="groupSync"
      outlined
      label="主催グループ"
      placeholder="traP"
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
      placeholder="Vue, なろう講習会, ..."
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
      label="description"
      :placeholder="'# You can write markdown here'"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
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
  @Prop() value!: boolean
  @PropSync('name') nameSync!: string
  @PropSync('group') groupSync!: string
  @PropSync('tags') tagsSync!: { name: string }[]
  @PropSync('description') descriptionSync!: string

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
