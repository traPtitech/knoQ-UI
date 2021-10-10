<template>
  <div>
    <div class="mb-3">
      {{ counts }}
    </div>
    <div v-for="attendee in attendeesSlice" :key="attendee.userId">
      <event-attendee-item
        :name="getName(attendee.userId)"
        :state="attendee.schedule"
        :icon="getUserIcon(attendee.userId)"
        :is-admin="isAdmin(attendee.userId)"
      />
    </div>
    <v-pagination v-model="page" :length="pageLength" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import {
  ResponseEvent,
  ResponseEventAttendees,
  ResponseEventAttendeesScheduleEnum,
} from '@/api'
import EventAttendeeItem from '@/components/event/EventAttendeeItem.vue'

@Component({
  components: {
    UserAvatar,
    EventAttendeeItem,
  },
})
export default class EventAttendees extends Vue {
  @Prop({ type: Object, required: true })
  event!: ResponseEvent
  @Prop({ type: Number, required: true })
  attendeesPerPage!: number

  attendanceCount: number = 0
  pendingCount: number = 0
  absentCount: number = 0
  attendees: ResponseEventAttendees[] = []
  page: number = 1

  async created() {
    this.attendees = this.event.attendees
  }

  @Watch('attendees', { deep: true, immediate: true })
  async updateCounts() {
    let _attendanceCount: number = 0
    let _pendingCount: number = 0
    let _absentCount: number = 0
    this.validAttendees.forEach(item => {
      if (item.schedule === ResponseEventAttendeesScheduleEnum.Attendance)
        _attendanceCount += 1
      if (item.schedule === ResponseEventAttendeesScheduleEnum.Absent)
        _absentCount += 1
      if (item.schedule === ResponseEventAttendeesScheduleEnum.Pending)
        _pendingCount += 1
    })
    this.attendanceCount = _attendanceCount
    this.pendingCount = _pendingCount
    this.absentCount = _absentCount
  }

  get validAttendees() {
    const _attendees = [...this.attendees]
    return _attendees.filter(
      attendee =>
        this.$store.direct.state.usersCache.users?.get(attendee.userId!) !==
        undefined
    )
  }
  get sortedAttendees() {
    const _attendees = [...this.validAttendees]
    _attendees.sort((a, b) => {
      const isAAdmin: boolean = this.isAdmin(a.userId)
      const isBAdmin: boolean = this.isAdmin(b.userId)
      if (isAAdmin === isBAdmin) {
        return 0
      } else if (isAAdmin) {
        return -1
      } else {
        return 1
      }
    })
    _attendees.sort((a, b) => {
      if (a.schedule === b.schedule) {
        return 0
      } else if (
        a.schedule === ResponseEventAttendeesScheduleEnum.Attendance ||
        b.schedule === ResponseEventAttendeesScheduleEnum.Pending
      ) {
        return -1
      } else {
        return 1
      }
    })
    return _attendees
  }
  isAdmin = (userId: string | undefined): boolean => {
    return this.event.admins.includes(userId || '')
  }
  getName = (userId: string | undefined): string | undefined => {
    return this.$store.direct.state.usersCache.users?.get(userId!)?.name
  }

  getUserIcon = (userId: string | undefined): string | undefined => {
    return this.$store.direct.state.usersCache.users?.get(userId!)?.icon
  }
  get pageLength(): number {
    return Math.ceil(this.validAttendees.length / this.attendeesPerPage)
  }
  get counts(): string {
    return `参加: ${this.attendanceCount}人, 欠席: ${this.absentCount}人, 未定: ${this.pendingCount}人`
  }

  get attendeesSlice(): ResponseEventAttendees[] {
    return this.sortedAttendees.slice(
      (this.page - 1) * this.attendeesPerPage,
      this.page * this.attendeesPerPage
    )
  }
}
</script>
