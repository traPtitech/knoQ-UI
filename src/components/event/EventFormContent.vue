<template>
  <v-form v-model="valid">
    <div class="mb-4 text--secondary caption">
      <span class="mr-1"> ※イベントを作るには主催するグループが必要です </span>
      <router-link to="/groups/new"> 新しくグループを作る </router-link>
    </div>
    <v-text-field
      v-model="nameInput"
      filled
      label="イベント名"
      placeholder="イベント名を入力"
      :rules="$rules.eventName"
    />
    <autocomplete
      v-model="groupInput"
      filled
      label="主催グループ"
      placeholder="グループを選択"
      :items="allGroups"
      item-text="name"
      :item-value="v => v"
      :rules="$rules.eventGroup"
    />
    <autocomplete
      v-model="adminsInput"
      filled
      multiple
      clearable
      :disabled="groupInput === null"
      label="イベント管理者"
      placeholder="イベント管理者を選択"
      :items="memberOfSelectedGroup"
      item-text="name"
      :item-value="v => v"
      :rules="$rules.eventAdmins"
    >
      <template #item="{ item }">
        <v-list-item-avatar>
          <trap-avatar size="36" :traq-id="item.name" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item-content>
      </template>
    </autocomplete>
    <v-combobox
      v-model="tagNames"
      filled
      multiple
      clearable
      label="タグ"
      placeholder="タグを選択または新規作成"
      :items="allTags"
    >
      <template #selection="{ item }">
        <event-tag
          :key="item"
          :name="item"
          close
          class="mt-3"
          @click:close="removeTag(item)"
        />
      </template>
    </v-combobox>
    <v-textarea
      v-model="descriptionInput"
      filled
      rows="25"
      no-resize
      label="説明"
      placeholder="# Markdownも書けます"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, PropSync } from 'vue-property-decorator'
import EventTag from '@/components/shared/EventTag.vue'
import TrapAvatar from '@/components/shared/TrapAvatar.vue'
import Autocomplete from '@/components/shared/Autocomplete.vue'
import { rmCtrlChar } from '@/workers/rmCtrlChar'
import api, {
  ResponseGroup,
  ResponseUser,
  RequestEventInstantTags,
} from '@/api'

export type EventInputContent = {
  name: string
  description: string
  group: ResponseGroup | null
  tags: { name: string }[]
  admins: ResponseUser[]
}

@Component({
  components: {
    EventTag,
    TrapAvatar,
    Autocomplete,
  },
})
export default class EventFormContent extends Vue {
  @Prop({ type: Boolean, required: true })
  value!: boolean

  @PropSync('name', { type: String, required: true })
  nameInput!: string

  @PropSync('group', {
    validator: prop => typeof prop === 'object' || prop === null,
    required: true,
  })
  groupInput!: ResponseGroup | null

  @PropSync('admins', { type: Array, required: true })
  adminsInput!: ResponseUser[]

  @PropSync('tags', { type: Array, required: true })
  tagsInput!: { name: string }[]

  @PropSync('description', { type: String, required: true })
  descriptionInput!: string

  allGroups: ResponseGroup[] = []
  allTags: string[] = []

  created() {
    Promise.all([this.fetchGroups(), this.fetchTags()])
  }
  async fetchGroups() {
    const [groups, groupIds] = await Promise.all([
      api.groups.getGroups(),
      api.groups.getMyGroups(),
    ])
    this.allGroups = groups.filter(group => groupIds.includes(group.groupId))
  }
  async fetchTags() {
    this.allTags = (await api.tags.getTag()).map(({ name }) => name)
  }

  private get valid(): boolean {
    return this.value
  }
  private set valid(value: boolean) {
    this.$emit('input', value)
  }

  removeTag(tag1: string) {
    this.tagNames = this.tagNames.filter(tag2 => tag1 !== tag2)
  }
  private get tagNames(): string[] {
    return this.tagsInput.map(tag => tag.name)
  }
  private set tagNames(tags: string[]) {
    this.tagsInput = tags
      .map(rmCtrlChar)
      .filter(name => !!name)
      .map(name => ({ name }))
  }

  private get memberOfSelectedGroup(): ResponseUser[] {
    const users = this.$store.direct.state.usersCache.users
    if (!users?.size || this.groupInput === null) {
      return []
    }
    return [...users.values()].filter(({ id }) =>
      this.groupInput?.members.includes(id)
    )
  }
}
</script>
