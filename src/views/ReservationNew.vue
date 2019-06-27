<template>
<v-container text-xs-center fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <h1>予約追加</h1>
      </v-flex>
      <v-flex xs12 sm10 mt-3>
        <v-card>
          <v-card-text>
            <v-form>
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
              <v-stepper v-model="e1">
              <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1" :rules="[rules.step1]">
                  step 1
                  <small>name is required</small>
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 2" step="2">step 2</v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="3">step 3</v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
              <v-layout column>
                <v-flex>
                  <v-autocomplete
                    v-model="reservation.group_id"
                    :items="$store.state.myGroups"
                    box
                    chips
                    color="blue-grey lighten-2"
                    label="グループ"
                    item-text="name"
                    item-value="id"
                  >
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-tile-content v-text="data.item"></v-list-tile-content>
                      </template>
                      <template v-else>
                        <v-list-tile-content>
                          <v-list-tile-title :class="groupColor(data.item.id)">◦{{data.item.name}}</v-list-tile-title>
                        </v-list-tile-content>
                      </template>
                    </template>
                    <template v-slot:append-item>
                      <v-list-tile
                        ripple
                        @click="$router.push({ name: 'GroupNew' })"
                      >
                        <v-list-tile-action>
                          <v-icon>add</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>グループを追加する</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </template>
                  </v-autocomplete>
                </v-flex>
                <v-flex>
                  <v-text-field v-model="reservation.name" label="名前"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-textarea
                    box
                    height="240"
                    name="description"
                    label="説明"
                    v-model="reservation.description"
                  >
                  </v-textarea>
                </v-flex>
              </v-layout>
                  <v-btn
                    @click="$router.push({ name: 'Home' })"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="e1 = 2"
                    :disabled="!nameIsRequired()"
                  >
                    Continue
                  </v-btn>
                </v-stepper-content>
                <v-stepper-content step="2">
                <v-layout wrap>
                <v-flex xs12>
                  <v-layout row>
                    <v-flex xs3>
                      <v-checkbox
                        v-model="Isrange"
                        label="範囲"
                      ></v-checkbox>
                    </v-flex>
                    <v-flex v-show="!Isrange" xs10>
                      <v-menu
                        ref="dateMenu"
                        v-model="dateMenu"
                        :close-on-content-click="false"
                        :nudge-right="0"
                        :return-value.sync="date"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="date"
                            label="日付"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="date" no-title :allowed-dates="allowedDates">
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
                          <v-btn flat color="primary" @click="$refs.dateMenu.save(date)">OK</v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex v-show="Isrange">
                      <v-layout>
                        <v-flex xs5>
                          <v-menu
                            ref="dateBeginMenu"
                            v-model="dateBeginMenu"
                            :close-on-content-click="false"
                            :nudge-right="0"
                            :return-value.sync="Condition.dateBegin"
                            lazy
                            transition="scale-transition"
                            offset-y
                            full-width
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="Condition.dateBegin"
                                label="begin"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker v-model="Condition.dateBegin" no-title :allowed-dates="allowedDates">
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="dateBeginMenu = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="$refs.dateBeginMenu.save(Condition.dateBegin); findRooms()">OK</v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-flex>
                        <v-flex xs5>
                        <v-menu
                            ref="dateEndMenu"
                            v-model="dateEndMenu"
                            :close-on-content-click="false"
                            :nudge-right="0"
                            :return-value.sync="Condition.dateEnd"
                            lazy
                            transition="scale-transition"
                            offset-y
                            full-width
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="Condition.dateEnd"
                                label="end"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker v-model="Condition.dateEnd" no-title :allowed-dates="allowedDates">
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="dateEndMenu = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="$refs.dateEndMenu.save(Condition.dateEnd); findRooms()">OK</v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-layout wrap>
                  <v-flex xs12 v-for="room in $store.state.allowedRooms" :key="room.id">
                    <v-layout row>
                      <v-flex xs1>
                        <v-checkbox v-model="reservation.room_id" :value="room.id"></v-checkbox>
                      </v-flex>
                      <v-flex xs11 style="padding-top:9px">
                        <RoomsExpansion :rooms=[room]></RoomsExpansion>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <v-layout justify-space-around>
                  <v-flex xs5>
                    <v-menu
                      ref="refStartMenu"
                      v-model="startMenu"
                      :close-on-content-click="false"
                      :return-value.sync="reservation.time_start"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="250px"
                      min-width="250px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="reservation.time_start"
                          label="開始時間"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="startMenu"
                        v-model="reservation.time_start"
                        format="24hr"
                        :allowed-minutes="allowedMinutes"
                        full-width
                        @click:minute="$refs.refStartMenu.save(reservation.time_start);findRooms()"
                      ></v-time-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs5>
                    <v-menu
                      ref="refEndMenu"
                      v-model="endMenu"
                      :close-on-content-click="false"
                      :return-value.sync="reservation.time_end"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="250px"
                      min-width="250px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="reservation.time_end"
                          label="終了時刻"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="endMenu"
                        v-model="reservation.time_end"
                        format="24hr"
                        :allowed-minutes="allowedMinutes"
                        full-width
                        @click:minute="$refs.refEndMenu.save(reservation.time_end)"
                      ></v-time-picker>
                    </v-menu>
                  </v-flex>
                </v-layout>
              </v-layout>
                  <v-btn
                    @click="e1 = 1"
                  >
                    back
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="e1 = 3; SelectRoom()"
                  >
                    Continue
                  </v-btn>
                </v-stepper-content>
                <v-stepper-content step="3">
                  <v-card color="blue-grey lighten-3">
                    <v-card-text>
                      <v-container>
                        <v-layout class="title">
                           <v-flex>
                              <div class="text-xs-left">予約: {{ reservation.name }}</div>
                            </v-flex>
                            <v-flex>
                              <div class="text-xs-right">グループ: {{ groupName }}</div>
                            </v-flex>
                        </v-layout>
                          <h6>説明</h6>
                        <v-flex  class="text-xs-left">
                          <span style="white-space: pre-wrap">{{ reservation.description }}</span>
                        </v-flex>
                      </v-container>
                      <RoomsExpansion v-if="e1 === 3" :rooms="selectedRoom"></RoomsExpansion>
                      <v-flex mt-3 class="title">{{reservation.time_start}} - {{reservation.time_end}}</v-flex>
                    </v-card-text>
                  </v-card>
                  <v-btn @click="e1 = 2">back</v-btn>
                  <v-btn color="info" :loading="IsLoading" @click="postReservation(reservation)">send</v-btn>
                </v-stepper-content>
              </v-stepper-items>
              </v-stepper>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import color from '../tips/color'
import RoomsExpansion from '../components/roomsExpansion'
import { RepositoryFactory } from '../repositories/RepositoryFactory'
const ReservationsRepository = RepositoryFactory.set('reservations')
const RoomsRepository = RepositoryFactory.set('rooms')
export default {
  components: {
    RoomsExpansion
  },
  data () {
    return {
      reservation: {
        name: ''
      },
      date: null,
      Condition: {},
      dateMenu: false,
      dateBeginMenu: false,
      dateEndMenu: false,
      startMenu: false,
      endMenu: false,
      IsLoading: false,
      Isrange: false,
      e1: 0,
      rules: {
        required: value => !!value || 'Required',
        step1: this.nameIsRequired
      },
      snackbar: false,
      snackMessage: '',
      selectedRoom: []
    }
  },
  created: async function () {
    await this.getUserMe()
    this.getMyGroups()
    window.addEventListener('beforeunload', function (event) {
      // event.returnValue = 'true'
    })
  },
  beforeRouteLeave (to, from, next) {
    // 空でない時
    if (Object.keys(this.reservation).length) {
      let message = '変更は保存されませんがよろしいですか?'
      let result = window.confirm(message)
      if (result) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  },
  methods: {
    allowedMinutes: m => m % 5 === 0,
    save: function () {
      console.log(this.reservation)
    },
    async postReservation (payload) {
      try {
        this.IsLoading = true
        const response = await ReservationsRepository.post(payload)
        this.snackMessage = response.statusText
        this.snackbar = true
        this.IsLoading = false
        this.reservation = {}
        this.e1 = 1
      } catch (error) {
        this.IsLoading = false
        this.snackMessage = error
        this.snackbar = true
      }
    },
    groupColor: function (groupID) {
      return color.GroupColors(groupID) + '--text'
    },
    findRooms: function () {
      console.log('find')
      this.reservation.room_id = null
      if (this.Isrange) {
        this.getRooms(this.Condition)
      }
    },
    nameIsRequired: function () {
      return this.reservation.name !== ''
    },
    allowedDates: val => {
      const date = new Date(val)
      return date.getTime() > new Date().getTime() - 86400000
    },
    SelectRoom: async function () {
      const { data } = await RoomsRepository.get({ id: this.reservation.room_id })
      console.log(data)
      this.selectedRoom = data
    },
    ...mapActions(['getRooms', 'getMyGroups', 'getUserMe']),
    ...mapGetters(['getRoomIDs', 'getGroupIDs'])
  },
  computed: {
    groupName: function () {
      let name = ''
      for (const group of this.$store.state.myGroups) {
        if (group.id === this.reservation.group_id) {
          name = group.name
          break
        }
      }
      return name
    }
  },
  watch: {
    date: function () {
      this.reservation.room_id = null
      if (!this.Isrange) {
        this.getRooms(
          {
            dateBegin: this.date,
            dateEnd: this.date
          }
        )
      }
    }
  }
}
</script>
