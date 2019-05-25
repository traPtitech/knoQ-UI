<template>
<v-container text-xs-center>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <h1>グループ追加</h1>
      </v-flex>
      <v-flex xs10 mt-5>
        <v-card>
          <v-card-text>
            <v-form>
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
                    <v-text-field v-model="group.name" :rules="[rules.required(group.name)]" label="名前"></v-text-field>
                    <v-text-field v-model="group.description" label="説明"></v-text-field>
                    <v-btn
                      color="primary"
                      @click="e1 = 2"
                      :disabled="!nameIsRequired()"
                    >
                      Continue
                    </v-btn>
                  </v-stepper-content>
                  <v-stepper-content step="2">
                    <v-container fluid>
                      <p>{{ group.members }},{{ ID }}</p>
                      <v-text-field
                        v-model="ID"
                        label="traQID"
                      >
                      </v-text-field>
                      <v-layout row wrap>
                        <v-flex xs12 sm6 md4 v-for="member in targetMembers" :key="member.traq_id">
                          <v-checkbox v-model="group.members" :value="member" >
                            <template v-slot:label>
                              <v-avatar size=32>
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
                    </v-container>
                    <v-btn
                      @click="e1 = 1"
                    >
                      Cansel
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="e1 = 3"
                    >
                      Continue
                    </v-btn>
                  </v-stepper-content>
                  <v-stepper-content step="3">
                    <v-btn @click="$router.push({ name: 'Home' })">キャンセル</v-btn>
                    <v-btn color="info" @click="postGroup(group), $router.push({ name: 'Home' })">保存</v-btn>
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
// import groupsRepository from '../repositories/groupsRepository'
export default {
  data () {
    return {
      ID: '',
      group: {
        name: '',
        members: [
          this.$store.state.loginUser
        ]
      },
      targetMembers: this.$store.state.allUsers,
      e1: 0,
      rules: {
        required: value => !!value || 'Required',
        step1: this.nameIsRequired
      }
    }
  },
  created: async function () {
    await this.getUsers()
  },
  methods: {
    ...mapActions(['getUsers', 'postGroup']),
    ...mapGetters(['gettraQIDs']),
    save: function () {
      console.log(this.group)
    },
    nameIsRequired: function () {
      return this.group.name !== ''
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
  }
}
</script>
