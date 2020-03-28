<template>
  <v-container>
    <ProgressCircular v-if="status === 'loading'" />
    <LoadFailedText v-else-if="status === 'error'" />
    <v-card v-else class="pa-9">
      <div class="mb-7">
        <h1 class="display-1 d-inline mr-5">{{ group.name }}</h1>
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
      </div>
      <MarkdownField :src="group.description" class="mb-7" />
      <div class="mb-7">
        <div class="text--secondary">Members</div>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header class="pa-0">
              <span class="headline">{{ group.members.length }} members</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <TrapAvatar
                v-for="memberName in memberNames"
                :key="memberName"
                size="36"
                :traq-id="memberName"
                class="mr-3 mb-2"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div>
        <div class="text--secondary">Events</div>
        <EventList :events="events" />
      </div>
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
import { RepositoryFactory } from '@/repositories/RepositoryFactory'

const GroupsRepo = RepositoryFactory.get('groups')
const EventsRepo = RepositoryFactory.get('events')

@Component({
  components: {
    MarkdownField,
    EventList,
    TrapAvatar,
    ProgressCircular,
    LoadFailedText,
  },
})
export default class Detail extends Vue {
  status: 'loading' | 'loaded' | 'error' = 'loading'
  group: Schemas.Group | null = null
  events: Schemas.Event[] | null = null

  created() {
    this.fetchGroupData()
  }

  async fetchGroupData() {
    this.status = 'loading'
    const groupId = this.$route.params.id
    try {
      ;[{ data: this.group }, { data: this.events }] = await Promise.all([
        GroupsRepo.$groupId(groupId).get(),
        EventsRepo.get({ groupId }),
      ])
      this.status = 'loaded'
    } catch (__) {
      this.status = 'error'
    }
  }

  async joinGroup() {
    const groupId = this.$route.params.id
    try {
      this.group = (await GroupsRepo.$groupId(groupId).members.me.put()).data
    } catch (__) {
      alert('Failed to join...')
    }
  }

  async leaveGroup() {
    const groupId = this.$route.params.id
    try {
      await GroupsRepo.$groupId(groupId).members.me.delete()
      this.group = (await GroupsRepo.$groupId(groupId).get()).data
    } catch (__) {
      alert('Failed to leave...')
    }
  }

  get joining(): boolean {
    const me = this.$store.direct.state.me
    if (!me || !this.group) return false
    return this.group.members.includes(me.id)
  }

  get memberNames(): string[] {
    const nameById = this.$store.direct.getters.usersCache.nameById
    return this.group.members.map(nameById)
  }
}
</script>

<style>
/* Remove shadow of expansion panel */
.v-expansion-panel::before {
  content: none;
}
</style>
