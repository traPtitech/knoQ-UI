<template>
  <div v-if="status === 'loading'">
    読み込み中...
  </div>
  <div v-else-if="status === 'error'">
    データを読み込めませんでした...
  </div>
  <v-card v-else class="px-3">
    <v-list>
      <v-list-item v-if="!groups.length">
        <span class="text--secondary">
          あなたの作成したグループはありません
        </span>
      </v-list-item>
      <template v-for="(group, i) in groups">
        <v-list-item :key="group.groupId">
          <v-row align="center" style="width: 100%;">
            <v-col class="text-truncate">
              {{ group.name }}
            </v-col>
            <v-col class="flex-grow-0">
              <v-btn
                small
                outlined
                color="primary"
                :to="`/groups/edit/${group.groupId}`"
              >
                EDIT
              </v-btn>
            </v-col>
          </v-row>
        </v-list-item>
        <v-divider :key="i" />
      </template>
      <v-list-item>
        <v-list-item-content>
          <v-btn depressed color="primary" to="/events/new">
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
import RepositoryFactory from '@/repositories/RepositoryFactory'
import { formatDate, today } from '@/workers/date'

const GroupsRepo = RepositoryFactory.get('groups')
const UsersRepo = RepositoryFactory.get('users')

@Component
export default class YourGroups extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  groups: Schemas.Group[] | null = null

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
    const [{ data: groups }, { data: groupIds }] = await Promise.all([
      GroupsRepo.get(),
      UsersRepo.me.groups.get(),
    ])
    this.groups = groups
      .filter(group => groupIds.includes(group.groupId))
      .filter(group => group.createdBy === this.$store.direct.state.me?.userId)
  }
}
</script>
