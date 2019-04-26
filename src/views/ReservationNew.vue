<template>
<v-container text-xs-center>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <h1>予約追加</h1>
      </v-flex>

      <v-flex xs10 sm6 mt-5>
        <v-card>
          <v-card-text>
            <v-form>
              <v-text-field v-model="reservation.group_id" label="グループid"></v-text-field>
              <v-text-field v-model="reservation.room_id" label="部屋id"></v-text-field>
              <v-menu
                ref="dateMenu"
                v-model="dateMenu"
                :close-on-content-click="false"
                :nudge-right="0"
                :return-value.sync="reservation.date"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="reservation.date"
                    label="日付"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="reservation.date" no-title>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.dateMenu.save(reservation.date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
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
              <v-btn color="info" @click="save">save</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      reservation: {},
      dateMenu: false,
      startMenu: false,
      endMenu: false
    }
  },
  methods: {
    allowedMinutes: m => m % 5 === 0,
    save: function () {
      console.log(this.reservation)
    }
  }
}
</script>
