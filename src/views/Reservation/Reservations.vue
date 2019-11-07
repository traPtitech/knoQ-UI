<template>
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs10 sm3>
          <v-text-field v-model="Condition.name" label="name" />
        </v-flex>
        <v-flex xs10 sm2>
          <v-combobox
            v-model="Condition.traQID"
            :items="gettraQIDs()"
            label="traQID"
          />
        </v-flex>
        <v-flex xs10 sm3>
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
            <v-date-picker v-model="Condition.dateBegin" no-title>
              <v-spacer />
              <v-btn flat color="primary" @click="menuBegin = false"
                >Cancel</v-btn
              >
              <v-btn
                flat
                color="primary"
                @click="$refs.menuBegin.save(Condition.dateBegin)"
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs10 sm3>
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
            <v-date-picker v-model="Condition.dateEnd" no-title>
              <v-spacer />
              <v-btn flat color="primary" @click="menuEnd = false"
                >Cancel</v-btn
              >
              <v-btn
                flat
                color="primary"
                @click="$refs.menuEnd.save(Condition.dateEnd)"
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs2 sm1>
          <v-btn icon @click="getReservations(Condition)">
            <v-icon>search</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <reservationShortCards :reservations="reservations" />
  </v-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import reservationShort from '@/components/reservation/short-card'
import reservationShortCards from '@/components/reservation/short-cards'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
const ReservationsRepository = RepositoryFactory.set('reservations')

export default {
  components: {
    reservationShortCards,
  },
  data() {
    return {
      reservations: [],
      Condition: {
        name: '',
        traQID: '',
        dateBegin: '',
        dateEnd: '',
      },
      menuBegin: false,
      menuEnd: false,
    }
  },
  created: function() {
    this.getUsers()
  },
  methods: {
    async getReservations(payload) {
      try {
        const response = await ReservationsRepository.get(payload)
        for (let i = 0; i < response.data.length; i++) {
          let date
          date = new Date(response.data[i].date)
          response.data[i].date = date
        }
        this.reservations = response.data
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    },
    ...mapActions(['getUsers']),
    ...mapGetters(['gettraQIDs']),
  },
}
</script>
