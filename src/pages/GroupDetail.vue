<template>
  <v-container>
    <progress-circular v-if="status === 'loading'" />
    <load-failed-text v-else-if="status === 'error'" />
    <v-card v-else class="pa-9">
      <div class="mb-7">
        <v-row no-gutters>
          <v-col>
            <h1 class="display-1 d-inline mr-5">{{ group && group.name }}</h1>
            <template v-if="group && group.open">
              <v-btn
                v-if="!joining"
                small
                depressed
                color="primary"
                class="mb-3"
                @click="joinGroup"
              >
                JOIN
              </v-btn>
              <v-btn
                v-else
                small
                outlined
                color="primary"
                class="mb-3"
                @click="leaveGroup"
              >
                JOINING
              </v-btn>
            </template>
          </v-col>
          <v-col class="flex-grow-0">
            <action-menu>
              <v-list-item v-if="isMyGroup" :to="`/groups/edit/${groupId}`">
                <v-list-item-title>Edit this group</v-list-item-title>
              </v-list-item>
            </action-menu>
          </v-col>
        </v-row>
      </div>
      <markdown-field :src="group ? group.description : ''" class="mb-7" />
      <v-tabs>
        <v-tab>Events</v-tab>
        <v-tab>Members</v-tab>
        <v-tab-item class="pt-6">
          <event-list :events="events" />
        </v-tab-item>
        <v-tab-item class="pt-6">
          <div class="text--secondary">{{ members.length }} members</div>
          <v-list>
            <v-list-item v-for="member in members" :key="member">
              <v-list-item-avatar>
                <user-avatar
                  size="36"
                  :user-id="member.name"
                  :user-icon="member.icon"
                />
              </v-list-item-avatar>
              <v-list-item-content>
                {{ member.name }}
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import MarkdownField from '@/components/shared/MarkdownField.vue'
import EventList from '@/components/event/EventList.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import ProgressCircular from '@/components/shared/ProgressCircular.vue'
import LoadFailedText from '@/components/shared/LoadFailedText.vue'
import ActionMenu from '@/components/shared/ActionMenu.vue'
import api, { ResponseGroup, ResponseEvent, ResponseUser } from '@/api'

@Component({
  components: {
    MarkdownField,
    EventList,
    UserAvatar,
    ProgressCircular,
    LoadFailedText,
    ActionMenu,
  },
})
export default class GroupDetail extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  group: ResponseGroup | null = null
  events: ResponseEvent[] = []

  get groupId(): string {
    return this.$route.params.id
  }

  async created() {
    this.status = 'loading'
    try {
      ;[this.group, this.events] = await Promise.all([
        api.groups.getGroup({ groupID: this.groupId }),
        api.events.getEventsOfGroup({ groupID: this.groupId }),
      ])
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }

  async joinGroup() {
    try {
      await api.groups.addMeToGroup({ groupID: this.groupId })
      this.group = await api.groups.getGroup({ groupID: this.groupId })
    } catch (__) {
      alert('Failed to join...')
    }
  }

  async leaveGroup() {
    try {
      await api.groups.deleteMeFromGroup({ groupID: this.groupId })
      this.group = await api.groups.getGroup({ groupID: this.groupId })
    } catch (__) {
      alert('Failed to leave...')
    }
  }

  get joining(): boolean {
    if (!this.me || !this.group) return false
    return this.group.members.includes(this.me)
  }

  get members(): ResponseUser[] {
    const userById = this.$store.direct.getters.usersCache.userById
    if (!this.group) return []
    return this.group.members.flatMap(userId => {
      const user = userById(userId)
      return user ? user : []
    })
  }

  get isMyGroup(): boolean {
    return !!this.me && (this.group?.admins.includes(this.me) ?? false)
  }

  get me(): string | undefined {
    return this.$store.direct.state.me?.userId
  }
}
</script>
