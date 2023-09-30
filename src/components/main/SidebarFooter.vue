<template>
  <v-row class="mx-4 mb-5" justify="space-between" align="center" dense>
    <v-col>knoQ {{ version }}</v-col>
    <v-col class="flex-grow-0">
      <v-tooltip v-if="isPrivilegedUser" top>
        <template #activator="{ on }">
          <v-btn
            icon
            title="workspaceRegistration"
            target="_blank"
            rel="noopener noreferer"
            @click="showModal"
            v-on="on"
          >
            <v-icon color="#EF3530">mdi-door-open</v-icon>
          </v-btn>
        </template>
        <span>進捗部屋を登録するためのフォームを表示します</span>
      </v-tooltip>
    </v-col>
    <v-col class="flex-grow-0">
      <v-btn
        icon
        title="help"
        href="https://wiki.trap.jp/SysAd/docs/knoQ"
        target="_blank"
        rel="noopener noreferer"
      >
        <v-icon>mdi-help</v-icon>
      </v-btn>
    </v-col>
    <v-dialog v-model="isVisible" max-width="600">
      <v-card>
        <v-card-title class="justify-center">
          <span class="headline"
            >進捗部屋の情報をcsv形式で入力してください</span
          >
        </v-card-title>
        <v-card-text no-resize filled>
          <v-textarea
            v-model="inputData"
            rows="20"
            no-resize
            filled
            :rules="$rules.verifiedRoom"
          />
          <div v-show="showError" class="ErrorMessage" style="color: #ef5350">
            データは6列で入力してください。
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="hideModal"> close </v-btn>
          <v-btn color="blue darken-1" text @click="saveData"> done </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { isValidVerifiedroomData } from '@/workers/isValidVerifiedroomData'
import { baseURL } from '@/workers/api'

export default {
  data() {
    return {
      inputData: '',
      isVisible: false,
      showError: false,
      version: import.meta.env.VITE_APP_VERSION,
    }
  },
  computed: {
    isPrivilegedUser(): boolean {
      return this.$store.direct.state.me?.privileged ?? false
    },
  },
  mounted: function () {
    window.onbeforeunload = () => {
      if (this.inputData) {
        return 'このページを離れると保存されていないデータは破棄されますが，よろしいですか。'
      }
    }
  },
  destroyed() {
    window.onbeforeunload = null
  },
  methods: {
    showModal() {
      this.isVisible = true
    },
    hideModal() {
      if (this.inputData) {
        if (confirm('入力されたデータは破棄されますが，よろしいですか。')) {
          this.isVisible = false
          this.showError = false
          this.inputData = ''
        }
        return
      }
    },
    async saveData() {
      if (isValidVerifiedroomData(this.inputData)) {
        this.showError = false
        try {
          await fetch(`${baseURL}/rooms/all`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'text/csv',
            },
            body: this.inputData,
          })
          this.inputData = ''
          this.isVisible = false
        } catch (error) {
          alert('データの送信に失敗しました。')
          console.error('There was a problem with the fetch operation:', error)
          this.inputData = ''
        }
      } else {
        this.showError = true
      }
    },
  },
}
</script>
