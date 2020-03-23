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
      :items="groupList"
      :rules="$rules.eventGroup"
    />
    <v-combobox
      v-model="_tags"
      outlined
      multiple
      label="タグ"
      placeholder="vue, narou, ..."
      :items="tagList"
    >
      <template #selection="data">
        <EventTag :key="data.item" :name="data.item" class="mt-3" />
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

@Component({
  components: {
    EventTag,
  },
})
export default class EventFormContent extends Vue {
  @Prop() value: boolean
  @PropSync('name') _name: string
  @PropSync('group') _group: string
  @Prop() tags: string[]
  @PropSync('description') _description: string

  groupList = Array.from({ length: 5 }, (v, i) => `group${i}`)
  tagList = ['react', 'vue', 'angular', 'svelte', 'riot']

  private get valid(): boolean {
    return this.value
  }
  private set valid(value: boolean) {
    this.$emit('input', value)
  }

  private get _tags(): string[] {
    return this.tags
  }
  private set _tags(tags: string[]) {
    // lower-cased alphanumeric characters only
    this.$emit(
      'update:tags',
      tags.map(v => v.replace(/[^a-z0-9]/gi, '').toLowerCase()).filter(v => !!v)
    )
  }
}
</script>
