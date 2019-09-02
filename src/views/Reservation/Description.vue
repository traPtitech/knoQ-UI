<template>
  <v-form v-if="!loading">
    <v-container 
      fluid 
      mt-3
    >
      <v-flex>
        <v-snackbar
          v-model="snackbar"
          top
        >
          {{ snackMessage }}
          <v-btn
            color="pink"
            flat
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>
        <v-card>
          <v-card-title 
            id="rev-name-title" 
            class="display-1 font-weight-bold" 
            primary-title
          >
            <div id="sampleCalender2">
              <div class="the_date orange">
                <div class="date_m title">{{ Month }}</div>
                <div class="date_d title">{{ day }}</div>
              </div>
            </div>
            {{ reservation.name }}
          </v-card-title>
          <v-card-text>
            <span 
              class="subheading" 
              v-html="reservation.description"
            />
            <v-layout wrap>
              <v-flex sm8>
                <v-btn 
                  v-if="$store.state.loginUser.traq_id == reservation.created_by.traq_id" 
                  flat 
                  disabled
                >
                  <v-icon>edit</v-icon>
                  edit this
                </v-btn>
                <v-btn
                  v-if="$store.state.loginUser.traq_id == reservation.created_by.traq_id"
                  flat
                  @click="Delete()"
                >
                  <v-icon>delete_forever</v-icon>
                  delete this
                </v-btn>
              </v-flex>
              <v-flex 
                xs12 
                sm4 
                text-xs-right
              >
                <span>Created by
                  <span>
                    <v-avatar
                      :size="24"
                    >
                      <img 
                        :src="'https://q.trapti.tech/static/icon/' + reservation.created_by.traq_id + '/64.png'" 
                        alt="avatar"
                      >
                    </v-avatar>
                  </span>
                  @{{ reservation.created_by.traq_id }}
                </span>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-container>
    <v-container fluid>
      <v-layout 
        text-xs-center 
        justify-center 
        wrap
      >
        <v-flex 
          xs12 
          md6
        >
          <v-card>
            <v-card-text class="title font-weight-bold">
              <div>日時と場所</div>
            </v-card-text>
            <v-card-text>
              <p class="title">{{ date }}</p>
              <p>{{ timeStart }} ~ {{ timeEnd }}</p>
              <p 
                style="cursor: pointer;"
                @click="openClassinfo(reservation.room.place)"
              >
                {{ reservation.room.place }}
              </p>
              <v-flex>
                <RoomsExpansion :rooms="[reservation.room]"/>
              </v-flex>
            </v-card-text>
            <v-card-actions>
              <v-flex>
                <v-btn 
                  flat 
                  color="orange" 
                  @click="AddGoogle()"
                >AddGoogleCalendar</v-btn>
              </v-flex>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex 
          xs12 
          md6
        >
          <v-card>
            <v-card-text class="title font-weight-bold">
              <div class="text-xs-center">グループ情報</div>
            </v-card-text>
            <v-card-text>
              <v-layout text-xs-left>
                <v-flex 
                  xs6 
                  class="title"
                >
                  <p>{{ reservation.group.name }}</p>
                </v-flex>
                <v-flex xs6>
                  <li>メンバー数 {{ reservation.group.members.length }}人</li>
                  <li>イベント回数 N回</li>
                </v-flex>
              </v-layout>
              <v-flex>
                <v-container 
                  grid-list-md 
                  text-xs-left
                >
                  <v-layout 
                    row 
                    wrap
                  >
                    <v-flex xs12>
                      <p>Members</p>
                    </v-flex>
                    <v-flex 
                      v-for="member in reservation.group.members.slice((pageSelected-1) * 2, pageSelected * 2)" 
                      :key="member.traq_id" 
                      xs12 
                      sm6 
                      md6
                    >
                      <v-card>
                        <v-card-text>
                          <v-avatar size="24">
                            <img
                              :src="'https://q.trapti.tech/static/icon/' + member.traq_id + '/64.png'"
                              :alt="member.traq_id"
                            >
                          </v-avatar>
                          <span style="margin-left:10px;">{{ member.traq_id }}</span>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-pagination
                  v-model="pageSelected"
                  :length="Math.ceil(reservation.group.members.length / 2)"
                  total-visible="5"
                />
              </v-flex>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import moment from 'moment'
import marked from 'marked'
import dateFormat from '@/tips/date'
import TokyoTech from '@/tips/TokyoTech'
import RoomsExpansion from '@/components/room/expansion'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
const ReservationsRepository = RepositoryFactory.set('reservations')

export default {
  components: {
    RoomsExpansion
  },
  data () {
    return {
      reservation: {},
      loading: true,
      pageSelected: 1,
      snackbar: false,
      snackMessage: ''
    }
  },
  computed: {
    Month () {
      const date = new Date(this.reservation.date)
      let month = date.getMonth()
      return dateFormat.formatEnglishMonths(month)
    },
    day () {
      const date = new Date(this.reservation.date)
      let day = date.getDate()
      return dateFormat.formatEnglishDays(day)
    },
    date () {
      const date = new Date(this.reservation.date)
      return moment(date).format('YYYY/MM/DD')
    },
    timeStart () {
      return this.reservation.time_start.slice(0, 5)
    },
    timeEnd () {
      return this.reservation.time_end.slice(0, 5)
    }
  },
  created: async function () {
    this.reservation.id = this.$route.params.id
    try {
      const response = await ReservationsRepository.get(this.reservation)
      console.log(response)
      this.reservation = response.data[0]
      this.reservation.date = new Date(this.reservation.date)
    } catch (error) {
      console.log(error)
    }

    const { data } = await ReservationsRepository.get({ roomID: this.reservation.room.id })
    const targetRevs = data
    this.reservation.room.reservations = []
    for (let reservation of targetRevs) {
      this.reservation.room.reservations.push(reservation)
    }

    this.reservation.description = marked(this.reservation.description)
    this.loading = false
  },
  methods: {
    Delete: async function () {
      let message = '本当に削除してよろしいですか?\n(この操作は取り消せません)'
      let result = window.confirm(message)
      if (result) {
        try {
          await ReservationsRepository.delete(this.reservation.id)
          this.snackMessage = '正常に削除されました。'
          this.snackbar = true
        } catch (error) {
          this.snackMessage = '削除に失敗しました。'
          this.snackbar = true
        }
      }
    },
    AddGoogle: function () {
      console.log(this.reservation)
      let link = 'https://calendar.google.com/calendar/r/eventedit'
      link += '?text=' + this.reservation.name +
              '&dates=' + dateFormat.FormatGoogle(this.reservation.date, this.reservation.time_start) +
                '/' + dateFormat.FormatGoogle(this.reservation.date, this.reservation.time_end) +
              '&location=' + this.reservation.room.place +
              '&details=' + this.reservation.description
      window.open(link)
    },
    openClassinfo: place => {
      const classLink = TokyoTech.searchRoom(place)
      window.open(classLink)
    }
  },
}
</script>

<style>
#rev-name-title {
  position: relative;
}

#rev-name-title:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 7px;
  background: -webkit-repeating-linear-gradient(-45deg, #c93a40, #c93a40 2px, #fff 2px, #fff 4px);
  background: repeating-linear-gradient(-45deg,#c93a40, #c93a40 2px, #fff 2px, #fff 4px);
}

div#sampleCalender2 {
        height:100%;
    }
    div#sampleCalender2 .the_date {
        float:left;
        display:block;
        width: 3em;
        margin:0 10px; padding:0;
        text-align:center;
        overflow:hidden;
    }
    div#sampleCalender2 .blue {
        background-color:#4096ee;
    }
    div#sampleCalender2 .pink {
        background-color:#ff0084;
    }
    div#sampleCalender2 .orange {
      background-color:#de9610;
    }
    div#sampleCalender2 .date_m {
        display:block;
        margin:3px 0; padding:0;
        color:#fff;
        font-weight:bold;
        text-align:center;
    }
    div#sampleCalender2 .date_d {
        display:block;
        margin:5px; padding:5px 0;
        background-color:#fff;
        font-size:1.3em;
        font-weight:bold;
        text-align:center;
        color:#666;
    }
</style>
