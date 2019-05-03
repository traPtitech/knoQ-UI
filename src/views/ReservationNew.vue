<template>
<v-container text-xs-center>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <h1>予約追加</h1>
      </v-flex>

      <v-flex xs10 sm8 mt-5>
        <v-card>
          <v-card-text>
            <v-form>
              <v-select
                v-model="reservation.group_id"
                :items="$store.state.myGroups"
                item-text="name"
                item-value="id"
                no-data-text="あなたが所属しているグループはありません"
                label="グループ"
              >
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
              </v-select>
              <v-text-field v-model="reservation.name" label="名前"></v-text-field>
              <v-text-field v-model="reservation.description" label="説明"></v-text-field>
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
                <v-date-picker v-model="date" no-title>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.dateMenu.save(date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
              <v-select
                v-model="reservation.room_id"
                :items="$store.state.allowedRooms"
                item-text="place"
                item-value="id"
                no-data-text="指定された日付の部屋は存在しません"
                label="部屋id"
              ></v-select>
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
                  @click:minute="$refs.refStartMenu.save(reservation.time_start)"
                ></v-time-picker>
              </v-menu>
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
              <v-btn @click="$router.push({ name: 'Home' })">キャンセル</v-btn>
              <v-btn color="info" @click="postReservation(reservation) ,$router.push({ name: 'Home' })">save</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      reservation: {},
      date: null,
      dateMenu: false,
      startMenu: false,
      endMenu: false
    }
  },
  methods: {
    allowedMinutes: m => m % 5 === 0,
    save: function () {
      console.log(this.reservation)
    },
    ...mapActions(['postReservation', 'getRooms']),
    ...mapGetters(['getRoomIDs', 'getGroupIDs'])
  },
  watch: {
    date: function () {
      this.reservation.room_id = null
      this.getRooms(this.date)
    }
  }
}
</script>
