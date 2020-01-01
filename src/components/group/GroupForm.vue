<template>
  <v-form v-model="_valid">
    <v-text-field
      filled
      label="name"
      v-model="_name"
      :rules="groupNameRules"
      class="mb-2"
    />
    <v-checkbox v-model="_joinFreely" label="Join freely" class="mt-0" />
    <v-autocomplete
      filled
      multiple
      label="members"
      :items="membersList"
      :rules="groupMembersRules"
      v-model="_members"
    />
    <v-textarea
      filled
      rows="5"
      label="description"
      no-resize
      placeholder="# You can write markdown here"
      v-model="_description"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import Rules from '@/utils/rules'

@Component
export default class GroupForm extends Vue {
  @Prop()
  name: string

  @Prop()
  description: string

  @Prop()
  members: string[]

  @Prop()
  joinFreely: boolean

  @Prop()
  valid: boolean

  membersList = ['fuji', 'you10', 'wasabi']

  groupNameRules = Rules.groupNameRules
  groupMembersRules = Rules.groupMembersRules

  private get _name(): string {
    return this.name
  }

  private set _name(value: string) {
    this.$emit('update:name', value)
  }

  private get _description(): string {
    return this.description
  }

  private set _description(value: string) {
    this.$emit('update:description', value)
  }

  private get _members(): string[] {
    return this.members
  }

  private set _members(value: string[]) {
    this.$emit('update:members', value)
  }

  private get _joinFreely(): boolean {
    return this.joinFreely
  }

  private set _joinFreely(value: boolean) {
    this.$emit('update:joinFreely', value)
  }

  private get _valid(): boolean {
    return this.valid
  }

  private set _valid(value: boolean) {
    this.$emit('input', value)
  }
}
</script>
