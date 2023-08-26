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
          <v-card-text>
            <v-textarea v-model="inputData" rows="20" />
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
interface TableData {
  subject: string
  place: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
}
export default {
  data() {
    return {
      inputData: '',
      tableData: [] as (TableData | null)[],
      isVisible: false,
      showError: false,
      tableHeaders: [
        { text: 'Subject', value: 'subject' },
        { text: 'Place', value: 'place' },
        { text: 'Start date', value: 'start_date' },
        { text: 'End date', value: 'end_date' },
        { text: 'Start time', value: 'start_time' },
        { text: 'End time', value: 'end_time' },
      ],
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
      const rows = this.inputData.split('\n')
      const csvData = rows.join('\n')
      this.inputData = ''
      const columns = rows.map(row => row.split(','))
      if (columns.every(cols => cols.length === 6)) {
        this.showError = false
        try {
          const response = await fetch(
            'http://knoq.trap.jp/api/rooms/all', //開発環境のAPI
            {
              method: 'POST',
              headers: {
                'Content-Type': 'text/csv',
              },
              body: csvData,
            }
          )
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          const text = await response.text()
          const data = JSON.parse(text)
          console.log('データが正常に送信されました。', data)
        } catch (error) {
          alert('Failed to submit')
          console.error('There was a problem with the fetch operation:', error)
        }
      } else {
        this.showError = true
      }
    },
  },
}
</script>
