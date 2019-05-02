<template>
<v-container text-xs-center>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <h1>グループ追加</h1>
      </v-flex>
            <v-flex xs5 mt-5>
        <v-card>
          <v-card-text>
            <v-form>
               <v-text-field v-model="group.name" label="名前"></v-text-field>
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
      group: {
        members: [this.$store.state.loginUser]
      }
    }
  },
  created: function () {
    this.getUsers()
  },
  methods: {
    ...mapActions(['getUsers', 'postGroup']),
    ...mapGetters(['gettraQIDs']),
    save: function () {
      console.log(this.group)
    }
  }
}
</script>
