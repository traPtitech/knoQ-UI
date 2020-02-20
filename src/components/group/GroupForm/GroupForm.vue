<template>
  <v-form v-model="valid">
    <v-text-field
      filled
      label="name"
      v-model="_name"
      :rules="$rules.groupName"
      class="mb-2"
    />
    <v-checkbox v-model="_joinFreely" label="Join freely" class="mt-0" />
    <v-autocomplete
      filled
      multiple
      label="members"
      :items="membersList"
      :rules="$rules.groupMembers"
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
