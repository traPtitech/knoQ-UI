<template>
  <v-container
    text-xs-center
    fluid
  >
    <v-layout
      row
      wrap
      justify-center
    >
      <v-flex xs12>
        <h1>予約追加</h1>
      </v-flex>
      <v-flex
        xs12
        sm10
        mt-3
      >
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
                  <v-stepper-step
                    :complete="e1 > 1"
                    :rules="[rules.step1]"
                    step="1"
                  >
                    Determine name and details
                    <small>name is required</small>
                  </v-stepper-step>

                  <v-divider/>

                  <v-stepper-step
                    :complete="e1 > 2"
                    step="2"
                  >
                    Select room and time
                  </v-stepper-step>

                  <v-divider/>

                  <v-stepper-step step="3">
                    Confirm request
                  </v-stepper-step>
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
                              <v-list-tile-content v-text="data.item"/>
                            </template>
                            <template v-else>
                              <v-list-tile-content>
                                <v-list-tile-title :class="groupColor(data.item.id)">◦{{ data.item.name }}</v-list-tile-title>
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
                        <v-text-field
                          v-model="reservation.name"
                          label="名前"
                        />
                      </v-flex>
                      <v-flex>
                        <v-textarea
                          v-model="reservation.description"
                          box
                          height="240"
                          name="description"
                          label="説明"
                        />
                      </v-flex>
                    </v-layout>
                    <v-btn
                      @click="$router.push({ name: 'Home' })"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      :disabled="!nameIsRequired()"
                      color="primary"
                      @click="e1 = 2"
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
                            />
                          </v-flex>
                          <v-flex
                            v-show="!Isrange"
                            xs10
                          >
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
                                />
                              </template>
                              <v-date-picker
                                v-model="date"
                                :allowed-dates="allowedDates"
                                no-title
                              >
                                <v-spacer/>
                                <v-btn
                                  flat
                                  color="primary"
                                  @click="dateMenu = false"
                                >Cancel</v-btn>
                                <v-btn
                                  flat
                                  color="primary"
                                  @click="$refs.dateMenu.save(date); getDayRooms()"
                                >OK</v-btn>
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
                                    />
                                  </template>
                                  <v-date-picker
                                    v-model="Condition.dateBegin"
                                    :allowed-dates="allowedDates"
                                    no-title
                                  >
                                    <v-spacer/>
                                    <v-btn
                                      flat
                                      color="primary"
                                      @click="dateBeginMenu = false"
                                    >Cancel</v-btn>
                                    <v-btn
                                      flat
                                      color="primary"
                                      @click="$refs.dateBeginMenu.save(Condition.dateBegin); getRooms()"
                                    >OK</v-btn>
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
                                    />
                                  </template>
                                  <v-date-picker
                                    v-model="Condition.dateEnd"
                                    :allowed-dates="allowedDates"
                                    no-title
                                  >
                                    <v-spacer/>
                                    <v-btn
                                      flat
                                      color="primary"
                                      @click="dateEndMenu = false"
                                    >Cancel</v-btn>
                                    <v-btn
                                      flat
                                      color="primary"
                                      @click="$refs.dateEndMenu.save(Condition.dateEnd); getRooms()"
                                    >OK</v-btn>
                                  </v-date-picker>
                                </v-menu>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-layout wrap>
                        <v-flex
                          v-for="room in allowedRooms"
                          :key="room.id"
                          xs12
                        >
                          <v-layout row>
                            <v-flex xs1>
                              <v-checkbox
                                v-model="reservation.room_id"
                                :value="room.id"
                              />
                            </v-flex>
                            <v-flex
                              xs11
                              style="padding-top:9px"
                            >
                              <RoomsExpansion :rooms="[room]"/>
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
                            max-width="250px"
                            min-width="250px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="reservation.time_start"
                                label="開始時間"
                                readonly
                                v-on="on"
                              />
                            </template>
                            <v-time-picker
                              v-if="startMenu"
                              v-model="reservation.time_start"
                              :allowed-minutes="FiveMinutes"
                              :min="selectedRoom[0].time_start.slice(0, 5)"
                              :max="selectedRoom[0].time_end.slice(0,5)"
                              format="24hr"
                              full-width
                              @click:minute="$refs.refStartMenu.save(reservation.time_start)"
                            />
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
                              />
                            </template>
                            <v-time-picker
                              v-if="endMenu"
                              v-model="reservation.time_end"
                              :allowed-minutes="FiveMinutes"
                              :min="selectedRoom[0].time_start.slice(0, 5)"
                              :max="selectedRoom[0].time_end.slice(0,5)"
                              format="24hr"
                              full-width
                              @click:minute="$refs.refEndMenu.save(reservation.time_end)"
                            />
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
                      @click="e1 = 3"
                    >
                      Continue
                    </v-btn>
                  </v-stepper-content>
                  <v-stepper-content step="3">
                    <ReservationConfirm
                      :reservation="reservation"
                      :selected-room="selectedRoom"
                    />
                    <v-btn @click="e1 = 2">back</v-btn>
                    <v-btn
                      :loading="IsLoading"
                      color="info"
                      @click="postReservation(reservation)"
                    >send</v-btn>
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
import color from '@/utils/color'
import RoomsExpansion from '@/components/room/expansion'
import ReservationConfirm from '@/components/reservation/confirm'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
const ReservationsRepository = RepositoryFactory.set('reservations')
const RoomsRepository = RepositoryFactory.set('rooms')
export default {
  components: {
    RoomsExpansion,
    ReservationConfirm
  },
  data () {
    return {
      reservation: { name: '', group_id: 0, room_id: '', time_start: '', time_end: '' },
      date: '',
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
      selectedRoom: [{ time_start: '', time_end: '' }],
      allowedRooms: []
    }
  },
  watch: {
    Isrange: function () {
      this.reservation.room_id = 0
      this.allowedRooms = []
    },
    'reservation.room_id': async function () {
      await this.SelectRoom()
      this.reservation.time_start = this.selectedRoom[0].time_start.slice(0, 5)
      this.reservation.time_end = this.selectedRoom[0].time_end.slice(0, 5)
    }
  },
  created: async function () {
    await this.getUserMe()
    await this.getMyGroups()
    this.reservation.group_id = parseInt(this.$route.query.group_id)
    console.log(this.reservation)
    window.addEventListener('beforeunload', function () {
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
    FiveMinutes: m => m % 5 === 0,
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
    nameIsRequired: function () {
      return this.reservation.name !== ''
    },
    allowedDates: val => {
      const date = new Date(val)
      return date.getTime() > new Date().getTime() - 86400000
    },
    SelectRoom: async function () {
      this.selectedRoom = [{ time_start: '', time_end: '' }]
      if (this.reservation.room_id === '' || this.reservation.room_id === null) return
      console.log(this.reservation.room_id)
      const { data } = await RoomsRepository.get({ id: this.reservation.room_id })
      this.selectedRoom = data
    },
    getRooms: async function () {
      let { data } = await RoomsRepository.get(this.Condition)
      this.allowedRooms = data

      let response = await ReservationsRepository.get(this.Condition)
      const targetRevs = response.data
      let i = 0
      for (let reservation of targetRevs) {
        for (; i < this.allowedRooms.length; i++) {
          if (reservation.room_id === this.allowedRooms[i].id) {
            if (typeof this.allowedRooms[i].reservations === 'undefined') {
              this.allowedRooms[i].reservations = []
            }
            this.allowedRooms[i].reservations.push(reservation)
            break
          }
        }
      }
    },
    getDayRooms: function () {
      this.Condition = {
        dateBegin: this.date,
        dateEnd: this.date
      }
      this.getRooms()
    },
    ...mapActions(['getMyGroups', 'getUserMe']),
    ...mapGetters(['getGroupIDs'])
  },
}
</script>
