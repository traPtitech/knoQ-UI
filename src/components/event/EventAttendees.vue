<template>
  <div>
    <div>参加予定</div>
    <div>
      参加:{{ attendanceCount }}人, 欠席:{{ absentCount }}人, 未定:{{
        pendingCount
      }}人
    </div>
    <div
      v-for="attendee in attendees.slice(page * 3 - 3, page * 3)"
      :key="attendee"
    >
      <event-attendee-item
        :user-id="attendee.userId"
        :state="attendee.schedule"
      />
    </div>
    <v-pagination v-model="page" :length="(attendees.length + 2) / 3" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import api, {
  ResponseEvent,
  ResponseEventAttendees,
  ResponseEventAttendeesScheduleEnum,
  ResponseEventDetail,
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

  attendanceCount: number = 0
  pendingCount: number = 0
  absentCount: number = 0
  attendees: ResponseEventAttendees[] = [
    { userId: 'aaa', schedule: ResponseEventAttendeesScheduleEnum.Pending },
    { userId: 'bbb', schedule: ResponseEventAttendeesScheduleEnum.Absent },
    { userId: 'ccc', schedule: ResponseEventAttendeesScheduleEnum.Attendance },
    { userId: 'ddd', schedule: ResponseEventAttendeesScheduleEnum.Attendance },
    { userId: 'eee', schedule: ResponseEventAttendeesScheduleEnum.Pending },
    { userId: 'fff', schedule: ResponseEventAttendeesScheduleEnum.Attendance },
    { userId: 'ggg', schedule: ResponseEventAttendeesScheduleEnum.Absent },
    { userId: 'hhh', schedule: ResponseEventAttendeesScheduleEnum.Absent },
  ]
  partialAttendees: ResponseEventAttendees[] | null = null
  page: number = 1

  async created() {
    // this.attendees = this.event.attendees
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
}
</script>
