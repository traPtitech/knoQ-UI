<template>
  <div>
    <v-app>
      <v-container>
        <v-btn @click="showModal"> 進捗部屋を登録 </v-btn>
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
              <div class="showInfoTable">
                <v-data-table :headers="tableHeaders" :items="tableData" />
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="blue darken-1" text @click="hideModal">
                close
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveData"> done </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-app>
  </div>
</template>

<script lang="ts">
interface TableData {
  subject: string
  location: string
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
        { text: 'Location', value: 'location' },
        { text: 'Start date', value: 'start_date' },
        { text: 'End date', value: 'end_date' },
        { text: 'Start time', value: 'start_time' },
        { text: 'End time', value: 'end_time' },
      ],
    }
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
    saveData() {
      const rows = this.inputData.split('\n')
      const newData = rows.map(row => {
        const columns = row.split(',')
        if (columns.length === 6) {
          return {
            subject: columns[0],
            location: columns[1],
            start_date: columns[2],
            end_date: columns[3],
            start_time: columns[4],
            end_time: columns[5],
          }
        } else {
          this.showError = true
          return null
        }
      })
      const validData = newData.filter(data => data !== null)
      this.tableData = [...this.tableData, ...validData]
      this.inputData = ''
    },
  },
}
</script>
