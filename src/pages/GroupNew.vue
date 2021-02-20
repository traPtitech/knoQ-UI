<template>
  <v-container>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">
          グループ詳細
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="step > 2" step="2"> 確認 </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <GroupFormContent v-model="valid" v-bind.sync="group" />
          <FormNextButton :disabled="!valid" @click="step = 2">
            Continue
          </FormNextButton>
        </v-stepper-content>

        <v-stepper-content step="2">
          <GroupFormSummary v-bind="group" />
          <FormBackButton class="mr-3" @click="step = 1"> Back </FormBackButton>
          <FormNextButton @click="submitGroup"> Submit </FormNextButton>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import GroupFormContent from '@/components/group/GroupFormContent.vue'
import GroupFormSummary from '@/components/group/GroupFormSummary.vue'
import FormNextButton from '@/components/shared/FormNextButton.vue'
import FormBackButton from '@/components/shared/FormBackButton.vue'
import RepositoryFactory from '@/repositories/RepositoryFactory'

const GroupsRepo = RepositoryFactory.get('groups')

@Component({
  components: {
    GroupFormContent,
    GroupFormSummary,
    FormNextButton,
    FormBackButton,
  },
})
export default class GroupNew extends Vue {
  valid = false
  step = 1

  group: API.Groups.Post.RequestBody = {
    name: '',
    description: '',
    members: [],
    open: false,
    admins: [],
  }

  async submitGroup() {
    try {
      await GroupsRepo.post(this.group)
    } catch (__) {
      alert('Failed to submit...')
      return
    }
    this.$router.push('/events/new')
  }
}
</script>
