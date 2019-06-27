<template>
<v-form v-if="!loading">
  <v-container fluid mt-3>
    <v-flex>
      <v-card>
        <v-card-title class="display-1 font-weight-bold" id="rev-name-title" primary-title>
          <div  id="sampleCalender2">
          <div class="the_date orange">
              <div class="date_m title">{{Month}}</div>
              <div class="date_d title">{{day}}</div>
          </div>
          </div>
          {{reservation.name}}
        </v-card-title>
        <v-card-text>
          <span class="subheading" style="white-space: pre-wrap">{{reservation.description}}</span>
          <v-layout wrap>
            <v-flex sm8>
              <v-btn flat disabled v-if="$store.state.loginUser.traq_id == reservation.created_by.traq_id">
                <v-icon>edit</v-icon>
                edit this
              </v-btn>
              <v-btn
                flat
                v-if="$store.state.loginUser.traq_id == reservation.created_by.traq_id"
                disabled
              >
                <v-icon>delete_forever</v-icon>
                delete this
              </v-btn>
            </v-flex>
            <v-flex xs12 sm4 text-xs-right>
              <span>Created by
                <span>
                  <v-avatar
                    :size="24"
                  >
                    <img :src="'https://q.trapti.tech/static/icon/' + reservation.created_by.traq_id + '/64.png'" alt="avatar">
                  </v-avatar>
                </span>
                @{{reservation.created_by.traq_id}}
              </span>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-container>
  <v-container fluid>
    <v-layout text-xs-center justify-center wrap>
      <v-flex xs12 md6>
        <v-card>
          <v-card-text class="title font-weight-bold">
            <div>日時と場所</div>
          </v-card-text>
          <v-card-text>
            <p class="title">{{date}}</p>
            <p>{{timeStart}} ~ {{timeEnd}}</p>
            <p>{{reservation.room.place}}</p>
            <v-flex>
              <RoomsExpansion :rooms=[reservation.room]></RoomsExpansion>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-flex>
              <v-btn flat disabled color="orange">AddGoogleCalendar</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
       <v-card>
          <v-card-text class="title font-weight-bold">
            <div class="text-xs-center">グループ情報</div>
          </v-card-text>
          <v-card-text>
            <v-layout text-xs-left>
              <v-flex xs6 class="title">
                <p>{{reservation.group.name}}</p>
              </v-flex>
              <v-flex xs6>
                <li>メンバー数 {{reservation.group.members.length}}人</li>
                <li>イベント回数 N回</li>
              </v-flex>
            </v-layout>
            <v-flex>
              <v-container grid-list-md text-xs-left>
                <v-layout row wrap>
                  <v-flex xs12>
                    <p>Members</p>
                  </v-flex>
                  <v-flex xs12 sm6 md6 v-for="member in reservation.group.members.slice((pageSelected-1) * 2, pageSelected * 2)" :key="member.traq_id">
                    <v-card>
                      <v-card-text>
                        <v-avatar size=24>
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
                total-visible="5"
                :length="Math.ceil(reservation.group.members.length / 2)"
              ></v-pagination>
            </v-flex>
         </v-card-text>
       </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</v-form>
</template>

<script>
import dateFormat from '../tips/date'
import moment from 'moment'
import RoomsExpansion from '../components/roomsExpansion'
import { RepositoryFactory } from '../repositories/RepositoryFactory'
const ReservationsRepository = RepositoryFactory.set('reservations')

export default {
  components: {
    RoomsExpansion
  },
  data () {
    return {
      reservation: {},
      loading: true,
      pageSelected: 1
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
    this.loading = false
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
  }
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
