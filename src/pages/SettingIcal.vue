<template>
  <v-container>
    <v-card class="pa-9">
      <h5 class="text-h5 mb-4">
        <v-icon class="mr-3">mdi-access-point</v-icon>
        <span>icsファイル配信URL</span>
      </h5>
      <div>
        <v-text-field
          filled
          readonly
          :disabled="shouldGenerateSecret"
          :value="icsURL"
          :append-outer-icon="'mdi-content-copy'"
          @click:append-outer="copyUrlToClipboard"
        />
        <v-btn color="primary" depressed @click="generateSecret">
          URLを{{ shouldGenerateSecret ? '生成' : '再生成' }}
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import { icalURL } from '@/workers/api'
import clipboard from '@cloudcmd/clipboard'

const UsersRepo = RepositoryFactory.get('users')

@Component
export default class SettingIcal extends Vue {
  secret: string = ''

  created() {
    this.fetchSecret()
  }

  get shouldGenerateSecret(): boolean {
    return this.secret === ''
  }

  get icsURL(): string {
    const me = this.$store.state.me?.userId
    const query = `user==${me}`
    return `${icalURL}/${me}${this.secret}?q=${encodeURIComponent(query)}`
  }

  async fetchSecret() {
    try {
      this.secret = (await UsersRepo.me.ical.get()).data.secret
    } catch (__) {
      alert('Failed to fetch secret')
    }
  }

  async generateSecret() {
    const ok = window.confirm(
      'URLを再生成すると以前のURLが使えなくなります。よろしいですか？'
    )
    if (!ok) {
      return
    }

    try {
      this.secret = (await UsersRepo.me.ical.put()).data.secret
    } catch (__) {
      alert('Failed to regenerate secret')
    }
  }

  copyUrlToClipboard() {
    clipboard
      .writeText(this.icsURL)
      .then(() => alert('Copied'))
      .catch(() => alert('Failed to copy'))
  }
}
</script>
