<template>
  <v-form v-model="valid" class="pt-2">
    <v-text-field
      v-model="_name"
      outlined
      label="グループ名"
      placeholder="Some group"
      :rules="$rules.groupName"
      class="mb-n6"
    />
    <v-checkbox v-model="_open" label="自由参加可能なグループ" />
    <v-autocomplete
      v-model="_members"
      outlined
      multiple
      label="メンバー"
      placeholder="trapyojo, ..."
      :items="allMembers"
      item-text="name"
      item-value="userId"
      :rules="$rules.groupMembers"
    >
      <template #item="{ item }">
        <v-list-item-avatar>
          <TrapAvatar size="36" :traq-id="item.name" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item-content>
      </template>
    </v-autocomplete>
    <v-textarea
      v-model="_description"
      outlined
      rows="10"
      label="説明"
      no-resize
      placeholder="# You can write markdown here"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, PropSync } from 'vue-property-decorator'
import TrapAvatar from '@/components/shared/TrapAvatar.vue'

@Component({
  components: {
    TrapAvatar,
  },
})
export default class GroupFormContent extends Vue {
  @PropSync('name') _name: string
  @PropSync('description') _description: string
  @PropSync('members') _members: string[]
  @PropSync('open') _open: boolean
  @Prop() value: boolean

  get allMembers(): Schemas.User[] {
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
