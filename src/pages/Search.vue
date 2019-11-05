<template>
  <v-form>
    <v-container>
      <v-progress-linear
        v-if="loading"
        :indeterminate="true"
        background-color="pink lighten-3"
        color="pink lighten-1"
      />
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
          <v-card
            v-if="!loading"
            raised
          >
            <v-card-text>
              <v-flex mt-3>
                <h3>所属メンバーから</h3>
                <reservationShortCards
                  v-if="ReservationsBytraQID.length > 0"
                  :reservations="ReservationsBytraQID"
                />
                <span v-else>該当するデータはありません</span>
              </v-flex>
              <v-flex mt-5>
                <h3>予約名から</h3>
                <reservationShortCards
                  v-if="ReservationsByName.length > 0"
                  :reservations="ReservationsByName"
                />
                <span v-else>該当するデータはありません</span>
              </v-flex>
            </v-card-text>
          </v-card>
          <v-progress-circular
            v-else
            :size="70"
            :width="7"
            color="purple"
            indeterminate
          />

        </v-tab-item>

        <v-tab-item>
          <v-card raised>
            <v-card-text>
              <v-flex mt-3>
                <h3>所属メンバーから</h3>
                <groupsTable
                  v-if="GroupsBytraQID.length > 0"
                  :groups="GroupsBytraQID"
                />
                <span v-else>該当するデータはありません</span>
              </v-flex>
              <v-flex mt-5>
                <h3>グループ名から</h3>
                <groupsTable
                  v-if="GroupsByName.length > 0"
                  :groups="GroupsByName"
                />
                <span v-else>該当するデータはありません</span>
              </v-flex>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-container>
  </v-form>
</template>

<script>
import reservationShortCards from '@/components/reservation/short-cards'
import groupsTable from '@/components/group/table'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
const ReservationsRepo = RepositoryFactory.set('reservations')
const GroupsRepo = RepositoryFactory.set('groups')

export default {
  components: {
    reservationShortCards,
    groupsTable
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
  watch: {
    '$route': 'FetchData'
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
}
</script>
