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
                <v-text-field v-model="group.name" label="名前"></v-text-field>
                <v-text-field v-model="group.description" label="説明"></v-text-field>
                <!--
                <v-select
                  v-model="group.members"
                  :items="$store.state.allUsers"
                  item-text="traq_id"
                  item-value="traq_id"
                  label="Select"
                  multiple
                  chips
                  hint="Users"
                  persistent-hint
                  return-object
                ></v-select>
                -->
                <v-container fluid>
                  <p>{{ group.members }} {{ ID }}</p>
                  <v-text-field
                    v-model="ID"
                    label="traQID"
                  ></v-text-field>
                  <v-layout row wrap>
                    <v-flex xs4 v-for="member in targetMembers" :key="member.traq_id">
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
               <v-btn @click="$router.push({ name: 'Home' })">キャンセル</v-btn>
               <v-btn color="info" @click="postGroup(group), $router.push({ name: 'Home' })">保存</v-btn>
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
      ID: '',
      group: {
        members: [
          this.$store.state.loginUser
        ]
      },
      targetMembers: this.$store.state.allUsers
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
