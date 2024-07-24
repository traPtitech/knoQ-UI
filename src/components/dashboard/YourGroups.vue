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

<script setup lang="ts">
import { ref } from 'vue'
import api, { ResponseGroup } from '@/api'
import { useStore } from '@/workers/store'

const store = useStore()

const status = ref<'loading' | 'loaded' | 'error'>('loading')
const groups = ref<ResponseGroup[]>([])

const fetchGroups = async () => {
  groups.value = (await api.groups.getGroups()).filter(group =>
    includesMe([...group.members, ...group.admins])
  )
}

const includesMe = (memberIds: string[]) =>
  memberIds.includes(store.direct.state.me?.userId ?? '')

;(async () => {
  status.value = 'loading'
  try {
    await fetchGroups()
    status.value = 'loaded'
  } catch (__) {
    status.value = 'error'
  }
})()
</script>
