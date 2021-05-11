<template>
  <v-container>
    <ProgressCircular v-if="status === 'loading'" />
    <LoadFailedText v-else-if="status === 'error'" />
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
            <ActionMenu>
              <v-list-item v-if="isMyGroup" :to="`/groups/edit/${groupId}`">
                <v-list-item-title>Edit this group</v-list-item-title>
              </v-list-item>
            </ActionMenu>
          </v-col>
        </v-row>
      </div>
      <MarkdownField :src="group ? group.description : ''" class="mb-7" />
      <v-tabs>
        <v-tab>Events</v-tab>
        <v-tab>Members</v-tab>
        <v-tab-item class="pt-6">
          <EventList :events="events" />
        </v-tab-item>
        <v-tab-item class="pt-6">
          <div class="text--secondary">{{ memberNames.length }} members</div>
          <v-list>
            <v-list-item v-for="memberName in memberNames" :key="memberName">
              <v-list-item-avatar>
                <TrapAvatar size="36" :traq-id="memberName" />
              </v-list-item-avatar>
              <v-list-item-content>
                {{ memberName }}
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
import TrapAvatar from '@/components/shared/TrapAvatar.vue'
import ProgressCircular from '@/components/shared/ProgressCircular.vue'
import LoadFailedText from '@/components/shared/LoadFailedText.vue'
import ActionMenu from '@/components/shared/ActionMenu.vue'
import api, { ResponseGroup, ResponseEvent } from '@/api'

@Component({
  components: {
    MarkdownField,
    EventList,
    TrapAvatar,
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
      this.group = await api.groups.addMeToGroup({ groupID: this.groupId })
    } catch (__) {
      alert('Failed to join...')
    }
  }

  async leaveGroup() {
    try {
      this.group = await api.groups.deleteMeFromGroup({ groupID: this.groupId })
    } catch (__) {
      alert('Failed to leave...')
    }
  }

  get joining(): boolean {
    const me = this.$store.direct.state.me
    if (!me || !this.group) return false
    return this.group.members.includes(me.userId)
  }

  get memberNames(): string[] {
    const nameById = this.$store.direct.getters.usersCache.nameById
    if (!this.group) return []
    return this.group.members.flatMap(userId => {
      const name = nameById(userId)
      return name ? name : []
    })
  }

  get isMyGroup(): boolean {
    return this.group?.createdBy === this.$store.direct.state.me?.userId
  }
}
</script>
