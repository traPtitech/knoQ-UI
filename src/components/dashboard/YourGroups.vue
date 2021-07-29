<template>
  <v-card class="px-3">
    <v-list>
      <v-list-item v-if="status === 'loading'">
        <span class="text--secondary"> 読み込み中... </span>
      </v-list-item>
      <v-list-item v-else-if="status === 'error'">
        <span class="text--secondary"> データを読み込めませんでした... </span>
      </v-list-item>
      <template v-else>
        <v-list-item v-if="!groups.length">
          <span class="text--secondary">
            あなたの作成したグループはありません
          </span>
        </v-list-item>
        <template v-for="(group, i) in groups">
          <v-list-item :key="group.groupId">
            <v-row align="center" style="width: 100%">
              <v-col class="text-truncate">
                <router-link :to="`/groups/${group.groupId}`">
                  {{ group.name }}
                </router-link>
              </v-col>
              <v-col class="flex-grow-0">
                <v-btn
                  v-if="includesMe(group.admins)"
                  small
                  outlined
                  color="primary"
                  :to="`/groups/edit/${group.groupId}`"
                >
                  編集
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item>
          <v-divider :key="i" />
        </template>
      </template>
      <v-list-item>
        <v-list-item-content>
          <v-btn depressed block color="primary" to="/groups/new">
            <v-icon small>mdi-plus</v-icon>
            新しいグループを作成
          </v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import api, { ResponseGroup } from '@/api'

@Component
export default class YourGroups extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  groups: ResponseGroup[] = []

  async created() {
    this.status = 'loading'
    try {
      await this.fetchGroups()
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }

  async fetchGroups() {
    this.groups = (await api.groups.getGroups())
      .filter(group => !group.isTraQGroup)
      .filter(group => this.includesMe([...group.members, ...group.admins]))
  }

  get includesMe() {
    return (memberIds: string[]) =>
      memberIds.includes(this.$store.direct.state.me?.userId ?? '')
  }
}
</script>
