<template>
  <v-form>
    <v-container>
      <v-layout
        row
        wrap
      >
        <v-flex
          xs10
          sm3
        >
          <v-menu
            ref="menuBegin"
            v-model="menuBegin"
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
              no-title
            >
              <v-spacer/>
              <v-btn
                flat
                color="primary"
                @click="menuBegin = false"
              >Cancel</v-btn>
              <v-btn
                flat
                color="primary"
                @click="$refs.menuBegin.save(Condition.dateBegin)"
              >OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex
          xs10
          sm3
        >
          <v-menu
            ref="menuEnd"
            v-model="menuEnd"
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
              no-title
            >
              <v-spacer/>
              <v-btn
                flat
                color="primary"
                @click="menuEnd = false"
              >Cancel</v-btn>
              <v-btn
                flat
                color="primary"
                @click="$refs.menuEnd.save(Condition.dateEnd)"
              >OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex
          xs2
          sm1
        >
          <v-btn
            icon
            @click="getRooms(Condition)"
          >
            <v-icon>search</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container>
      <v-layout>
        <v-flex>
          <RoomsExpansion :rooms="rooms"/>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>
<script>
import RoomsTable from '@/components/room/table'
import RoomsExpansion from '@/components/room/expansion'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
const RoomsRepository = RepositoryFactory.set('rooms')
const ReservationsRepo = RepositoryFactory.set('reservations')

export default {
  components: {
    RoomsTable,
    RoomsExpansion
  },
  data () {
    return {
      rooms: [],
      reservations: [],
      Condition: {
        dateBegin: '',
        dateEnd: ''
      },
      menuBegin: false,
      menuEnd: false
    }
  },
  methods: {
    async getRooms (payload) {
      try {
        const response = await RoomsRepository.get(payload)
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].date = response.data[i].date.substr(0, 10)
        }
        this.rooms = response.data
        await this.getReservations(this.Condition)
        let i = 0
        for (let reservation of this.reservations) {
          for (; i < this.rooms.length; i++) {
            if (reservation.room_id === this.rooms[i].id) {
              if (typeof this.rooms[i].reservations === 'undefined') {
                this.rooms[i].reservations = []
              }
              this.rooms[i].reservations.push(reservation)
              break
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getReservations (payload) {
      const { data } = await ReservationsRepo.get(payload)
      this.reservations = data
    }
  }
}

</script>
