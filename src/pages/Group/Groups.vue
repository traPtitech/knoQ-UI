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
        <v-flex xs2 sm1>
          <v-btn icon @click="getGroups(Condition)">
            <v-icon>search</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container>
      <v-layout>
        <v-flex>
          <GroupsTable :groups="groups" />
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import GroupsTable from '@/components/group/table'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
const GroupsRepository = RepositoryFactory.get('groups')

export default {
  components: {
    GroupsTable,
  },
  data() {
    return {
      groups: [],
      Condition: {
        name: '',
        traQID: '',
      },
    }
  },
  created: function() {
    this.getUsers()
  },
  methods: {
    async getGroups(payload) {
      try {
        const response = await GroupsRepository.get(payload)
        this.groups = response.data
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
