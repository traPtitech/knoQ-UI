<template>
<v-form>
  <v-container>
      <v-progress-linear
        v-if="loading"
        :indeterminate="true"
        background-color="pink lighten-3"
        color="pink lighten-1"
      >
      </v-progress-linear>
      <v-tabs
        v-model="active"
        color="cyan"
        dark
        slider-color="yellow"
        fixed-tabs
      >
        <v-tab
          ripple
        >
          reservation
        </v-tab>
        <v-tab
          ripple
        >
          group
        </v-tab>

        <v-tab-item>
          <v-card raised>
            <v-card-text>
              <v-flex mt-3>
                <h3>所属メンバーから</h3>
                <reservationCardShorts
                  v-if="ReservationsBytraQID.length > 0"
                  :reservations="ReservationsBytraQID"
                >
                </reservationCardShorts>
                <span v-else>該当するデータはありません</span>
                </v-flex>
              <v-flex mt-5>
                <h3>予約名から</h3>
                <reservationCardShorts
                  v-if="ReservationsByName.length > 0"
                  :reservations="ReservationsByName"
                >
                </reservationCardShorts>
                <span v-else>該当するデータはありません</span>
              </v-flex>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>あいうえお</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
  </v-container>
</v-form>
</template>

<script>
import reservationCardShorts from '../components/reservationCardShorts'
import { RepositoryFactory } from '../repositories/RepositoryFactory'
const ReservationsRepo = RepositoryFactory.set('reservations')
const GroupsRepo = RepositoryFactory.set('groups')

export default {
  components: {
    reservationCardShorts
  },
  data () {
    return {
      active: '',
      loading: false,
      ReservationsBytraQID: [],
      ReservationsByName: [],
      GroupsBytraQID: [],
      GroupsByName: []
    }
  },
  created: async function () {
    await this.FetchData()
  },
  methods: {
    FetchData: async function () {
      this.loading = true
      const query = this.$route.query.q
      let condition = { traQID: { traQID: query }, name: { name: query } }
      let response
      // Todo 高速化
      response = await ReservationsRepo.get(condition['traQID'])
      this.ReservationsBytraQID = response.data
      response = await ReservationsRepo.get(condition['name'])
      this.ReservationsByName = response.data
      response = await GroupsRepo.get(condition['traQID'])
      this.GroupsBytraQID = response.data
      response = await GroupsRepo.get(condition['name'])
      this.GroupsByName = response.data
      this.loading = false
    }
  },
  watch: {
    '$route': 'FetchData'
  }
}
</script>
