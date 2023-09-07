<template>
  <div>
    <v-container>
      <v-btn @click="showModal"> 進捗部屋を登録 </v-btn>
      <!--<v-btn @click="showModal" v-if="isPrivilegedUser"> 進捗部屋を登録 </v-btn>
      <div v-else>進捗部屋を登録できるのは特権ユーザーのみです。</div>-->
      <v-dialog v-model="isVisible" max-width="600">
        <v-card>
          <v-card-title>
            <span class="headline"
              >進捗部屋の情報をcsv形式で入力してください。</span
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
            <div v-show="showError" class="ErrorMessage">
              正しい形式で入力してください。
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="hideModal"> close </v-btn>
            <v-btn color="blue darken-1" text @click="saveData"> done </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script lang="ts">
import { parse } from 'csv-parse/sync'

export default {
  data() {
    return {
      inputData: '',
      isVisible: false,
      showError: false,
    }
  },
  computed: {
    isPrivilegedUser(): boolean {
      return this.$store.direct.state.me?.privileged ?? false
    },
  },
  methods: {
    showModal() {
      this.isVisible = true
    },
    hideModal() {
      this.isVisible = false
      this.showError = false
      this.inputData = ''
    },
    async saveData() {
      const records = parse(this.inputData, {
        delimiter: ',',
        relax_column_count: true,
      })
      if (records.every(record => record.length === 6)) {
        this.showError = false
        try {
          const response = await fetch('http://localhost:6006/api/rooms/all', {
            //開発環境url
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'text/csv',
            },
            body: records,
          })
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          console.log('データが正常に送信されました。', response)
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
