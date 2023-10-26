<template>
  <v-container>
    <ProgressCircular v-if="status === 'loading'" />
    <LoadFailedText v-else-if="status === 'error'" />
    <template v-else-if="!canEdit">
      <v-icon large color="error" class="mr-5">mdi-alert-circle</v-icon>
      <span class="text--secondary headline">
        このグループは編集できません
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
import api, { RequestGroup } from '@/api'
import router from '@/router'
import { useDraftConfirmer } from '@/workers/draftConfirmer'
import { removeDraftConfirmer } from '@/workers/draftConfirmer'

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

  group: RequestGroup | null = null
  originalGroup: RequestGroup | null = null
  beforeEachControl: (() => void) | null = null

  get groupId() {
    return this.$route.params.id
  }

  async created() {
    this.status = 'loading'
    try {
      const group = await api.groups.getGroup({ groupID: this.groupId })
      this.group = group
      this.originalGroup = JSON.parse(JSON.stringify(group))
      this.canEdit =
        !group.isTraQGroup && !!this.me && group.admins.includes(this.me)
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }

  isChanged(): boolean {
    if (this.group && this.originalGroup) {
      return JSON.stringify(this.group) !== JSON.stringify(this.originalGroup)
    }
    return false
  }

  cleanupContent(): void {
    this.group = this.originalGroup
  }

  beforeLeaveGuard = (to, from, next) => {
    if (from.path !== `/groups/edit/${this.groupId}` || !this.isChanged()) {
      return next()
    }

    if (
      confirm(
        '入力されたデータは送信されないまま破棄されますが，よろしいですか。'
      )
    ) {
      removeDraftConfirmer()
      this.cleanupContent()
      return next()
    }

    return next(false)
  }

  async submitGroup() {
    if (!this.group) return
    try {
      await api.groups.updateGroup({
        groupID: this.groupId,
        requestGroup: this.group,
      })
      removeDraftConfirmer()
      this.cleanupContent()
      this.$router.push(`/groups/${this.groupId}`)
    } catch (__) {
      alert('Failed to submit...')
    }
  }

  async deleteGroup() {
    try {
      let events = await api.events.getEventsOfGroup({
        groupID: this.groupId,
      })
      if (events.length != 0) {
        alert(
          'このGroupにはEventの情報が残っています。削除するためにはEventを全て削除してください。'
        )
        return
      }
    } catch (__) {
      alert('このGroupの詳細を確認できませんでした。')
    }
    const confirmed = window.confirm(
      'この操作は取り消せません。本当にこのグループを削除してもよろしいですか？'
    )
    if (!confirmed) return
    try {
      await api.groups.deleteGroup({ groupID: this.groupId })
      removeDraftConfirmer()
      this.cleanupContent()
      this.$router.push('/groups')
    } catch (error) {
      alert('Failed to delete...')
    }
  }

  mounted() {
    this.$watch(
      'group',
      () => {
        if (this.isChanged()) {
          useDraftConfirmer()
        } else {
          removeDraftConfirmer()
        }
      },
      { deep: true }
    )
    this.beforeEachControl = router.beforeEach(this.beforeLeaveGuard)
  }

  beforeDestroy() {
    if (this.beforeEachControl) {
      this.beforeEachControl()
    }
  }

  get me(): string | undefined {
    return this.$store.direct.state.me?.userId
  }
}
</script>
