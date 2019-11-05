<template>
  <v-container
    fluid
    text-xs-center
  >
    <v-layout
      row
      wrap
      justify-center
    >
      <v-flex xs12>
        <h1>グループ編集</h1>
      </v-flex>
      <v-flex
        xs12
        mt-5
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
                    step 1
                    <small>name is required</small>
                  </v-stepper-step>

                  <v-divider/>

                  <v-stepper-step
                    :complete="e1 > 2"
                    step="2"
                  >step 2</v-stepper-step>

                  <v-divider/>

                  <v-stepper-step step="3">step 3</v-stepper-step>
                </v-stepper-header>
                <v-stepper-items>
                  <v-stepper-content step="1">
                    <v-text-field
                      v-model="group.name"
                      :rules="[rules.required(group.name)]"
                      label="名前"
                    />
                    <v-textarea
                      v-model="group.description"
                      box
                      height="240"
                      name="description"
                      label="説明"
                    />
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
                    <v-container fluid>
                      <v-container
                        fluid
                        grid-list-md
                        text-xs-left
                      >
                        <v-layout
                          row
                          wrap
                        >
                          <v-flex
                            v-for="member in group.members.slice((pageSelected-1) * displaySelectedNum, pageSelected * displaySelectedNum)"
                            :key="member.traq_id"
                            xs12
                            sm6
                            md4
                          >
                            <v-card>
                              <v-card-text>
                                <v-avatar size="24">
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
                        :length="Math.ceil(group.members.length / displaySelectedNum)"
                        total-visible="5"
                      />
                      <v-text-field
                        v-model="ID"
                        label="traQID"
                      />
                      <v-layout
                        row
                        wrap
                      >
                        <v-flex
                          v-for="member in targetMembers.slice((page-1) * displayMemberNum, page * displayMemberNum)"
                          :key="member.traq_id"
                          xs12
                          sm6
                          md4
                        >
                          <v-checkbox
                            v-model="group.members"
                            :value="member"
                          >
                            <template v-slot:label>
                              <v-avatar size="32">
                                <img
                                  :src="'https://q.trapti.tech/static/icon/' + member.traq_id + '/64.png'"
                                  :alt="member.traq_id"
                                >
                              </v-avatar>
                              <span style="margin-left:10px;">{{ member.traq_id }}</span>
                            </template>
                          </v-checkbox>
                        </v-flex>
                      </v-layout>
                      <v-pagination
                        v-model="page"
                        :length="Math.ceil(targetMembers.length / displayMemberNum)"
                        total-visible="5"
                      />
                    </v-container>
                    <v-btn @click="e1 = 1">
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
                    <GroupConfirm :group="group"/>
                    <v-btn @click="e1 = 2">back</v-btn>
                    <v-btn
                      color="info"
                      @click="patchGroup(group)"
                    >保存</v-btn>
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
import marked from 'marked'
import GroupConfirm from '@/components/group/confirm'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
const GroupsRepository = RepositoryFactory.set('groups')

export default {
  components: {
    GroupConfirm
  },
  data () {
    return {
      ID: '',
      group: {
        name: '',
        members: []
      },
      targetMembers: this.$store.state.allUsers,
      e1: 0,
      rules: {
        required: value => !!value || 'Required',
        step1: this.nameIsRequired
      },
      displayMemberNum: 24,
      displaySelectedNum: 3,
      page: 1,
      pageSelected: 1,
      snackbar: false,
      snackMessage: ''
    }
  },
  computed: {
    markedDescription: function () {
      return marked(this.group.description)
    }
  },
  watch: {
    ID: function () {
      if (this.ID !== '') {
        this.targetMembers = []
        for (let v of this.$store.state.allUsers) {
          if (v.traq_id.indexOf(this.ID) === 0) {
            this.targetMembers.push(v)
          }
        }
      } else {
        this.targetMembers = this.$store.state.allUsers
      }
    }
  },
  created: async function () {
    await this.getUsers()
    this.targetMembers = this.$store.state.allUsers
    this.group.members.push(this.$store.state.loginUser)

    const { data } = await GroupsRepository.get({
      id: this.$route.params.id
    })
    this.group = data[0]
    console.log(this.group)
  },
  beforeRouteLeave (to, from, next) {
    // 空でない時
    if (Object.keys(this.group).length) {
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
    ...mapActions(['getUsers']),
    ...mapGetters(['gettraQIDs']),
    save: function () {
      console.log(this.group)
    },
    nameIsRequired: function () {
      return this.group.name !== ''
    },
    async patchGroup (group) {
      try {
        const response = await GroupsRepository.patch(this.$route.params.id, group)
        console.log(response)
        this.snackMessage = response.statusText
        this.snackbar = true
        this.e1 = 1
      } catch (error) {
        this.snackMessage = error
        this.snackbar = true
      }
    }
  },
}
</script>
