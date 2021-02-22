<template>
  <v-container>
    <ProgressCircular v-if="status === 'loading'" />
    <LoadFailedText v-else-if="status === 'error'" />
    <v-card v-else class="pa-9">
      <div class="mb-7">
        <v-row no-gutters>
          <v-col>
            <h1 class="display-1 d-inline mr-5">{{ group && group.name }}</h1>
            <template v-if="group.open">
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
      <MarkdownField :src="group.description" class="mb-7" />
      <v-tabs>
        <v-tab>Events</v-tab>
        <v-tab>Members</v-tab>
        <v-tab-item class="pt-6">
          <EventList :events="allEventData" />
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
import RepositoryFactory from '@/repositories/RepositoryFactory'

const GroupsRepo = RepositoryFactory.get('groups')
const RoomsRepo = RepositoryFactory.get('rooms')

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
  group: Schemas.Group | null = null
  events: Schemas.Event[] | null = null
  rooms: Map<string, Schemas.Room> | null = null

  async created() {
    this.status = 'loading'
    try {
      await Promise.all([
        this.fetchGroup(),
        this.fetchEvents(),
        this.fetchRooms(),
      ])
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }
  async fetchGroup() {
    this.group = (await GroupsRepo.$groupId(this.groupId).get()).data
  }
  async fetchEvents() {
    this.events = (await GroupsRepo.$groupId(this.groupId).events.get()).data
  }
  async fetchRooms() {
    const rooms = new Map<string, Schemas.Room>()
    const { data } = await RoomsRepo.get()
    data.forEach(room => rooms.set(room.roomId, room))
    this.rooms = rooms
  }

  async joinGroup() {
    try {
      await GroupsRepo.$groupId(this.groupId).members.me.put()
      this.group = (await GroupsRepo.$groupId(this.groupId).get()).data
    } catch (__) {
      alert('Failed to join...')
    }
  }

  async leaveGroup() {
    try {
      await GroupsRepo.$groupId(this.groupId).members.me.delete()
      this.group = (await GroupsRepo.$groupId(this.groupId).get()).data
    } catch (__) {
      alert('Failed to leave...')
    }
  }

  get groupId(): string {
    return this.$route.params.id
  }

  get allEventData() {
    if (!this.events || !this.rooms) return []
    return [...this.events]
      .sort((e1, e2) => (e1.timeStart < e2.timeStart ? -1 : 1))
      .map(event => ({ ...event, place: this.rooms?.get(event.roomId)?.place }))
  }

  get joining(): boolean {
    const me = this.$store.direct.state.me
    if (!me || !this.group) return false
    return this.group.members.includes(me.userId)
  }

  get memberNames(): (string | undefined)[] {
    const nameById = this.$store.direct.getters.usersCache.nameById
    return this.group?.members.map(nameById).filter(v => v) ?? []
  }

  get isMyGroup(): boolean {
    return this.group?.createdBy === this.$store.direct.state.me?.userId
  }
}
</script>
