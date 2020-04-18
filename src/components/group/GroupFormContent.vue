<template>
  <v-form v-model="valid" class="pt-2">
    <v-text-field
      v-model="nameSync"
      filled
      label="グループ名"
      :rules="$rules.groupName"
      class="mb-n6"
    />
    <v-checkbox v-model="openSync" label="自由参加可能なグループにする" />
    <v-autocomplete
      v-model="membersSync"
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
      v-model="descriptionSync"
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
import 'reflect-metadata'
import { Component, Prop, PropSync } from 'vue-property-decorator'
import TrapAvatar from '@/components/shared/TrapAvatar.vue'

@Component({
  components: {
    TrapAvatar,
  },
})
export default class GroupFormContent extends Vue {
  @PropSync('name', { required: true }) nameSync!: string
  @PropSync('description', { required: true }) descriptionSync!: string
  @PropSync('members', { required: true }) membersSync!: string[]
  @PropSync('open', { required: true }) openSync!: boolean
  @Prop({ required: true }) value!: boolean

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
