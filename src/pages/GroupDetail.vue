<template>
  <v-form v-if="!loading">
    <v-container fluid mt-3>
      <v-flex>
        <v-card>
          <v-card-title
            id="rev-name-title"
            primary-title
            class="display-1 font-weight-bold"
          >
            {{ group.name }}
            <v-spacer />
            <v-btn
              icon
              color="pink lighten-3"
              large
              @click="
                $router.push({
                  name: 'ReservationNew',
                  query: { group_id: group.id },
                })
              "
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span class="subheading" v-html="group.description" />
            <v-layout wrap>
              <v-flex sm8>
                <v-btn
                  v-if="
                    $store.state.loginUser.traq_id == group.created_by.traq_id
                  "
                  flat
                  @click="$router.push({ name: 'GroupEdit' })"
                >
                  <v-icon>edit</v-icon>
                  edit this
                </v-btn>
                <v-btn
                  v-if="
                    $store.state.loginUser.traq_id == group.created_by.traq_id
                  "
                  flat
                  disabled
                >
                  <v-icon>delete_forever</v-icon>
                  delete this
                </v-btn>
              </v-flex>
              <v-flex xs12 text-xs-right>
                <span
                  >Created by
                  <span>
                    <v-avatar :size="24">
                      <img
                        :src="
                          'https://q.trapti.tech/static/icon/' +
                            group.created_by.traq_id +
                            '/64.png'
                        "
                        alt="avatar"
                      />
                    </v-avatar>
                  </span>
                  @{{ group.created_by.traq_id }}
                </span>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-container>
    <v-container fluid>
      <v-layout text-xs-center justify-center wrap>
        <v-flex xs12 md5>
          <v-card>
            <v-card-text class="title font-weight-bold">
              <div>メンバー</div>
            </v-card-text>
            <v-card-text>
              <v-container grid-list-md text-xs-left>
                <v-layout row wrap>
                  <v-flex xs12>
                    <p>Members</p>
                  </v-flex>
                  <v-flex
                    v-for="member in group.members.slice(
                      (pageSelected - 1) * 4,
                      pageSelected * 4
                    )"
                    :key="member.traq_id"
                    xs12
                    sm6
                    md6
                  >
                    <v-card>
                      <v-card-text>
                        <v-avatar size="24">
                          <img
                            :src="
                              'https://q.trapti.tech/static/icon/' +
                                member.traq_id +
                                '/64.png'
                            "
                            :alt="member.traq_id"
                          />
                        </v-avatar>
                        <span style="margin-left:10px;">{{
                          member.traq_id
                        }}</span>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-pagination
                v-model="pageSelected"
                :length="Math.ceil(group.members.length / 4)"
              />
            </v-card-text>
            <v-card-actions>
              <v-flex />
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12 md7>
          <v-card>
            <v-card-text class="title font-weight-bold">
              <div>予約情報</div>
            </v-card-text>
            <v-card-text>
              <v-layout row wrap text-xs-left>
                <v-flex xs12>
                  <h3>今後の予約</h3>
                  <v-container>
                    <v-layout row wrap>
                      <v-flex
                        v-for="reservation in futureReservations"
                        :key="reservation.id"
                        xs12
                      >
                        <ReservationShort :reservation="reservation" />
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-flex>
                <v-flex>
                  <span>これまでの予約</span>
                  <v-container>
                    <v-layout row wrap>
                      <v-flex
                        v-for="reservation in previousReservations"
                        :key="reservation.id"
                        xs12
                      >
                        <ReservationShort :reservation="reservation" />
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import moment from 'moment'
import ReservationShort from '@/components/reservation/short-card'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
import { render } from '@/utils/markdown-it'
const GroupsRepository = RepositoryFactory.get('groups')
const ReservationsRepository = RepositoryFactory.get('reservations')

export default {
  components: {
    ReservationShort,
  },
  data() {
    return {
      group: {},
      futureReservations: [],
      previousReservations: [],
      loading: true,
      pageSelected: 1,
    }
  },
  created: async function() {
    this.group.id = this.$route.params.id
    // GET Group
    try {
      const response = await GroupsRepository.get(this.group)
      console.log(response)
      this.group = response.data[0]
    } catch (error) {
      console.log(error)
    }

    const today = moment().format('YYYY-MM-DD')
    // GET Future reservation
    try {
      const response = await ReservationsRepository.get({
        groupID: this.group.id,
        dateBegin: today,
      })
      this.futureReservations = response.data
      console.log(this.futureReservations)
    } catch (error) {
      console.log(error)
    }

    // GET Previous reservation
    const yesterday = moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DD')
    try {
      const response = await ReservationsRepository.get({
        groupID: this.group.id,
        dateEnd: yesterday,
      })
      this.previousReservations = response.data
    } catch (error) {
      console.log(error)
    }

    this.group.description = render(this.group.description)
    this.loading = false
  },
}
</script>

<style>
#rev-name-title {
  position: relative;
}

#rev-name-title:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 7px;
  background: -webkit-repeating-linear-gradient(
    -45deg,
    #c93a40,
    #c93a40 2px,
    #fff 2px,
    #fff 4px
  );
  background: repeating-linear-gradient(
    -45deg,
    #c93a40,
    #c93a40 2px,
    #fff 2px,
    #fff 4px
  );
}
</style>
