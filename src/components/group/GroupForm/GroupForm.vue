<template>
  <v-form v-model="valid">
    <v-text-field
      v-model="_name"
      filled
      label="name"
      :rules="$rules.groupName"
      class="mb-2"
    />
    <v-checkbox v-model="_joinFreely" label="Join freely" class="mt-0" />
    <v-autocomplete
      v-model="_members"
      filled
      multiple
      label="members"
      :items="membersList"
      :rules="$rules.groupMembers"
    />
    <v-textarea
      v-model="_description"
      filled
      rows="5"
      label="description"
      no-resize
      placeholder="# You can write markdown here"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, PropSync } from 'vue-property-decorator'

@Component
export default class GroupForm extends Vue {
  @PropSync('name') _name: string
  @PropSync('description') _description: string
  @PropSync('members') _members: string[]
  @PropSync('joinFreely') _joinFreely: boolean
  @Prop() value: boolean

  membersList = ['fuji', 'you10', 'wasabi']

  private get valid(): boolean {
    return this.value
  }
  private set valid(value: boolean) {
    this.$emit('input', value)
  }
}
</script>
