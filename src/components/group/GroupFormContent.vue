<template>
  <v-form v-model="valid" class="pt-2">
    <v-text-field
      v-model="nameInput"
      filled
      label="グループ名"
      :rules="$rules.groupName"
      class="mb-n6"
    />
    <v-checkbox v-model="openInput" label="自由参加可能なグループにする" />
    <autocomplete
      v-model="adminsInput"
      filled
      multiple
      label="管理者"
      :items="allMembers"
      item-text="name"
      item-value="userId"
      :rules="$rules.groupMembers"
    >
      <template #item="{ item }">
        <v-list-item-avatar>
          <TrapAvatar size="36" :traq-id="item.name" :userIcon="item.icon" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item-content>
      </template>
    </autocomplete>
    <autocomplete
      v-model="membersInput"
      filled
      multiple
      label="メンバー"
      :items="allMembers"
      item-text="name"
      item-value="userId"
      :rules="$rules.groupMembers"
    >
      <template #item="{ item }">
        <v-list-item-avatar>
          <TrapAvatar size="36" :traq-id="item.name" :userIcon="item.icon" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item-content>
      </template>
    </autocomplete>
    <v-textarea
      v-model="descriptionInput"
      filled
      rows="10"
      label="説明"
      no-resize
      placeholder="# You can write Markdown here"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, PropSync } from 'vue-property-decorator'
import TrapAvatar from '@/components/shared/TrapAvatar.vue'
import Autocomplete from '@/components/shared/Autocomplete.vue'
import { ResponseUser } from '@/api'

export type GroupFormContentProps = {
  name: string
  description: string
  admins: string[]
  members: string[]
  open: boolean
}

@Component({
  components: {
    TrapAvatar,
    Autocomplete,
  },
})
export default class GroupFormContent extends Vue {
  @PropSync('name', { type: String, required: true })
  nameInput!: string

  @PropSync('description', { type: String, required: true })
  descriptionInput!: string

  @PropSync('admins', { type: Array, required: true })
  adminsInput!: string[]

  @PropSync('members', { type: Array, required: true })
  membersInput!: string[]

  @PropSync('open', { type: Boolean, required: true })
  openInput!: boolean

  @Prop({ type: Boolean, required: true })
  value!: boolean

  get allMembers(): ResponseUser[] {
    return [...(this.$store.direct.state.usersCache.users?.values() ?? [])]
  }

  private get valid(): boolean {
    return this.value
  }
  private set valid(value: boolean) {
    this.$emit('input', value)
  }
}
</script>
