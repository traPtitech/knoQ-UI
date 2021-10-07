<template>
  <div>
    <div class="mb-3">
      {{ counts }}
    </div>
    <div v-for="attendee in attendeesSlice" :key="attendee.userId">
      <event-attendee-item
        :user-id="attendee.userId"
        :state="attendee.schedule"
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
  attendees: ResponseEventAttendees[] = [
    {
      userId: 'a',
      schedule: ResponseEventAttendeesScheduleEnum.Pending,
    },
    {
      userId: 'bbb',
      schedule: ResponseEventAttendeesScheduleEnum.Absent,
    },
    {
      userId: 'ccccc',
      schedule: ResponseEventAttendeesScheduleEnum.Attendance,
    },
    {
      userId: 'dddddddddd',
      schedule: ResponseEventAttendeesScheduleEnum.Pending,
    },
    {
      userId: 'eeeeeeeeeeeeeeeeee',
      schedule: ResponseEventAttendeesScheduleEnum.Pending,
    },
    { userId: 'fff', schedule: ResponseEventAttendeesScheduleEnum.Attendance },
    { userId: 'ggg', schedule: ResponseEventAttendeesScheduleEnum.Absent },
    { userId: 'hhh', schedule: ResponseEventAttendeesScheduleEnum.Absent },
  ]
  page: number = 1

  async created() {
    // this.attendees = this.event.attendees
    this.updateCounts()
  }

  @Watch('attendees', { deep: true, immediate: true })
  async updateCounts() {
    let _attendanceCount: number = 0
    let _pendingCount: number = 0
    let _absentCount: number = 0
    this.attendees.forEach(item => {
      if (item.schedule == ResponseEventAttendeesScheduleEnum.Attendance)
        _attendanceCount += 1
      if (item.schedule == ResponseEventAttendeesScheduleEnum.Absent)
        _absentCount += 1
      if (item.schedule == ResponseEventAttendeesScheduleEnum.Pending)
        _pendingCount += 1
    })
    this.attendanceCount = _attendanceCount
    this.pendingCount = _pendingCount
    this.absentCount = _absentCount
  }

  public isAdmin(userId: string | undefined): boolean {
    // return this.event.admins.includes(userId || '')
    return true
  }

  public get pageLength(): number {
    return Math.ceil(this.attendees.length / this.attendeesPerPage)
  }
  public get counts(): string {
    return (
      '参加: ' +
      this.attendanceCount +
      '人, 欠席: ' +
      this.absentCount +
      '人, 未定: ' +
      this.pendingCount +
      '人'
    )
  }
  public get attendeesSlice(): ResponseEventAttendees[] {
    return this.attendees.slice(
      (this.page - 1) * this.attendeesPerPage,
      this.page * this.attendeesPerPage
    )
  }
}
</script>
