<template>
  <v-form v-model="isValidRef">
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
    <v-checkbox
      v-model="openInput"
      dense
      label="グループ外の人も参加できるようにする"
      class="mt-n2"
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
          <user-avatar size="36" :user-id="item.name" :user-icon="item.icon" />
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

<script setup lang="ts">
import { computed, ref } from 'vue'
import EventTag from '@/components/shared/EventTag.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import Autocomplete from '@/components/shared/Autocomplete.vue'
import { rmCtrlChar } from '@/workers/rmCtrlChar'
import api, {
  ResponseGroup,
  ResponseUser,
  GetMyGroupsRelationEnum,
} from '@/api'
import { useStore } from '@/workers/store'

export type EventInputContent = {
  name: string
  description: string
  group: ResponseGroup | null
  open: boolean
  tags: { name: string }[]
  admins: ResponseUser[]
}

const store = useStore()

const props = defineProps<{
  isValid: boolean
  content: EventInputContent
}>()

const emits = defineEmits<{
  (e: 'update:isValid', value: boolean): void
  (e: 'update:content', value: EventInputContent): void
}>()

const nameInput = computed({
  get: () => props.content.name,
  set: (v: string) => emits('update:content', { ...props.content, name: v }),
})

const groupInput = computed({
  get: () => props.content.group,
  set: (v: ResponseGroup | null) =>
    emits('update:content', { ...props.content, group: v }),
})

const openInput = computed({
  get: () => props.content.open,
  set: (v: boolean) => emits('update:content', { ...props.content, open: v }),
})

const adminsInput = computed({
  get: () => props.content.admins,
  set: (v: ResponseUser[]) =>
    emits('update:content', { ...props.content, admins: v }),
})

const tagsInput = computed({
  get: () => props.content.tags,
  set: (v: { name: string }[]) =>
    emits('update:content', { ...props.content, tags: v }),
})

const descriptionInput = computed({
  get: () => props.content.description,
  set: (v: string) =>
    emits('update:content', { ...props.content, description: v }),
})

const isValidRef = computed({
  get: () => props.isValid,
  set: (newValue: boolean) => emits('update:isValid', newValue),
})

const tagNames = computed({
  get: () => tagsInput.value.map(tag => tag.name),
  set: (tags: string[]) =>
    (tagsInput.value = tags
      .map(rmCtrlChar)
      .filter(name => !!name)
      .map(name => ({ name }))),
})

const allGroups = ref<ResponseGroup[]>([])
const allTags = ref<string[]>([])

const sortGroups = (
  a: ResponseGroup,
  b: ResponseGroup,
  currentUser: ResponseUser
) => {
  const adminA = a.admins.includes(currentUser.userId) ? -1 : 1
  const adminB = b.admins.includes(currentUser.userId) ? -1 : 1
  if (adminA !== adminB) {
    return adminA - adminB
  } else {
    return a.name.localeCompare(b.name)
  }
}
const fetchGroups = async () => {
  const [groups, groupIds] = await Promise.all([
    api.groups.getGroups(),
    api.groups.getMyGroups({ relation: GetMyGroupsRelationEnum.Belongs }),
  ])
  const currentUser = store.direct.state.me!
  if (!currentUser) {
    return
  }
  allGroups.value = groups
    .sort((a, b) => sortGroups(a, b, currentUser))
    .filter(group => groupIds.includes(group.groupId))
}
const fetchTags = async () => {
  allTags.value = (await api.tags.getTag()).map(({ name }) => name)
}

;(async () => Promise.all([fetchGroups(), fetchTags()]))()

const removeTag = (tag1: string) => {
  tagNames.value = tagNames.value.filter(tag2 => tag1 !== tag2)
}

const memberOfSelectedGroup = computed(() => {
  const users = store.direct.state.usersCache.users
  if (!users?.size || groupInput.value === null) {
    return []
  }
  return [...users.values()].filter(({ userId }) =>
    groupInput.value?.members.includes(userId)
  )
})
</script>
