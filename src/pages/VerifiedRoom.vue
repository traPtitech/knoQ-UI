<template>
  <div>
    <v-app>
      <v-container>
        <!--<v-btn @click="showModal"> 進捗部屋を登録 </v-btn> 自分の作業用-->
        <v-btn @click="showModal" v-if="isPrivilegedUser">
          進捗部屋を登録
        </v-btn>
        <div v-else>
          あなたは編集権限がないユーザーなので，進捗部屋の登録をすることはできません。
        </div>
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
import { RequestRoom } from '@/api/generated/models/RequestRoom'
import api from '@/api'
import { ResponseUser } from '@/api/generated/models/ResponseUser'
import { UsersApi } from '@/api/generated/apis/UsersApi'

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
      user: null as ResponseUser | null,
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
      return this.user?.privileged ?? false
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
    async created() {
      const usersApi = new UsersApi()
      this.user = await usersApi.getMe()
    },
    async saveData() {
      // const roomsApi = new RoomsApi()
      const rows = this.inputData.split('\n')
      const newData = rows.map(row => {
        const columns = row.split(',')
        if (columns.length === 6) {
          this.showError = false
          return {
            subject: columns[0],
            place: columns[1],
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
      this.inputData = ''

      for (const data of validData) {
        const requestRoom: RequestRoom = {
          place: data?.place ?? '',
          timeStart: data?.start_date
            ? data.start_date + 'T' + data.start_time + ':00.000Z'
            : '',
          timeEnd: data?.end_date
            ? data.end_date + 'T' + data.end_time + ':00.000Z'
            : '',
          admins: ['1eea935c-0d3c-411b-a565-1b09565237f4'], //誰がadminになるべきか
        }
        try {
          const response = await api.rooms.addRooms({ requestRoom })
          console.log(response)
        } catch (__) {
          alert('Failed to submit')
        }
      }
    },
  },
}
</script>
