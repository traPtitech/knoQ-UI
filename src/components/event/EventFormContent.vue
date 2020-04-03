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
      v-model="_name"
      outlined
      label="イベント名"
      placeholder="Some event"
      :rules="$rules.eventName"
    />
    <v-autocomplete
      v-model="_group"
      outlined
      label="主催グループ"
      placeholder="traP"
      :items="allGroups"
      item-text="name"
      :item-value="v => v"
      :rules="$rules.eventGroup"
    />
    <v-combobox
      v-model="_tags"
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
      v-model="_description"
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
import { removeCtrlChars } from '@/workers/removeCtrlChars'
import RepositoryFactory from '@/repositories/RepositoryFactory'

const GroupsRepo = RepositoryFactory.get('groups')
const TagsRepo = RepositoryFactory.get('tags')

@Component({
  components: {
    EventTag,
  },
})
export default class EventFormContent extends Vue {
  @Prop() value: boolean
  @PropSync('name') _name: string
  @PropSync('group') _group: string
  @Prop() tags: { name: string }[]
  @PropSync('description') _description: string

  allGroups: Schemas.Group[] = []
  allTags: string[] = []

  created() {
    Promise.all([this.fetchGroups(), this.fetchTags()])
  }
  async fetchGroups() {
    this.allGroups = (await GroupsRepo.get()).data
  }
  async fetchTags() {
    this.allTags = (await TagsRepo.get()).data.map(({ name }) => name)
  }

  removeTag(tag: string) {
    this._tags = this._tags.filter(_tag => _tag !== tag)
  }

  private get valid(): boolean {
    return this.value
  }
  private set valid(value: boolean) {
    this.$emit('input', value)
  }

  private get _tags(): string[] {
    return this.tags.map(tag => tag.name)
  }
  private set _tags(tags: string[]) {
    const newTags = tags.flatMap(tag => {
      const name = removeCtrlChars(tag)
      return name ? { name } : []
    })
    this.$emit('update:tags', newTags)
  }
}
</script>
