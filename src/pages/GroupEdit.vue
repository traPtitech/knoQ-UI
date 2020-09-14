<template>
  <v-container>
    <ProgressCircular v-if="status === 'loading'" />
    <LoadFailedText v-else-if="status === 'error'" />
    <template v-else-if="!canEdit">
      <v-icon large color="error" class="mr-5">mdi-alert-circle</v-icon>
      <span class="text--secondary headline">
        traP公式のグループは編集できません
      </span>
    </template>
    <template v-else>
      <v-stepper v-model="step" class="mb-5">
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
            <FormBackButton class="mr-3" @click="step = 1">
              Back
            </FormBackButton>
            <FormNextButton @click="submitGroup"> Submit </FormNextButton>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <v-card class="px-5 pt-5 pb-3">
        <span class="headline mr-3"> Delete this group </span>
        <v-btn small depressed color="error" class="mb-2" @click="deleteGroup">
          Delete
        </v-btn>
      </v-card>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import GroupFormContent from '@/components/group/GroupFormContent.vue'
import GroupFormSummary from '@/components/group/GroupFormSummary.vue'
import FormNextButton from '@/components/shared/FormNextButton.vue'
import FormBackButton from '@/components/shared/FormBackButton.vue'
import ProgressCircular from '@/components/shared/ProgressCircular.vue'
import LoadFailedText from '@/components/shared/LoadFailedText.vue'
import RepositoryFactory from '@/repositories/RepositoryFactory'

const GroupsRepo = RepositoryFactory.get('groups')

@Component({
  components: {
    GroupFormContent,
    GroupFormSummary,
    FormNextButton,
    FormBackButton,
    ProgressCircular,
    LoadFailedText,
  },
})
export default class GroupEdit extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  canEdit = true
  valid = false
  step = 1

  group: Schemas.Group | null = null

  async created() {
    this.status = 'loading'
    const groupId = this.$route.params.id
    try {
      await this.fetchGroupData()
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }

  async fetchGroupData() {
    const groupId = this.$route.params.id
    const group = (await GroupsRepo.$groupId(groupId).get()).data
    if (group.isTraQGroup) {
      this.canEdit = false
    } else {
      this.group = group
    }
  }

  async submitGroup() {
    const groupId = this.$route.params.id
    if (!this.group) return
    try {
      await GroupsRepo.$groupId(groupId).put(this.group)
      this.$router.push(`/groups/${groupId}`)
    } catch (__) {
      alert('Failed to submit...')
    }
  }

  async deleteGroup() {
    const confirmed = window.confirm(
      'この操作は取り消せません。本当にこのグループを削除してもよろしいですか？'
    )
    if (!confirmed) return
    const groupId = this.$route.params.id
    try {
      await GroupsRepo.$groupId(groupId).delete()
      this.$router.push('/')
    } catch (__) {
      alert('Failed to submit...')
    }
  }
}
</script>
