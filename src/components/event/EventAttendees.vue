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

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ResponseEventDetail, ResponseEventAttendeesScheduleEnum } from '@/api'
import EventAttendeeItem from '@/components/event/EventAttendeeItem.vue'
import { useStore } from '@/workers/store'

const store = useStore()

const props = defineProps<{
  event: ResponseEventDetail
  attendeesPerPage: number
}>()

const attendanceCount = ref(0)
const pendingCount = ref(0)
const absentCount = ref(0)
const page = ref(1)

const attendees = computed(() => props.event.attendees)

const validAttendees = computed(() => {
  const _attendees = [...attendees.value]
  return _attendees.filter(
    attendee =>
      store.direct.state.usersCache.users?.get(attendee.userId!) !== undefined
  )
})

const updateCounts = computed(async () => {
  let _attendanceCount: number = 0
  let _pendingCount: number = 0
  let _absentCount: number = 0
  validAttendees.value.forEach(item => {
    if (item.schedule === ResponseEventAttendeesScheduleEnum.Attendance)
      _attendanceCount += 1
    if (item.schedule === ResponseEventAttendeesScheduleEnum.Absent)
      _absentCount += 1
    if (item.schedule === ResponseEventAttendeesScheduleEnum.Pending)
      _pendingCount += 1
  })
  attendanceCount.value = _attendanceCount
  pendingCount.value = _pendingCount
  absentCount.value = _absentCount
})

const sortedAttendees = computed(() => {
  const _attendees = [...validAttendees.value]
  _attendees.sort((a, b) => {
    const isAAdmin: boolean = isAdmin.value(a.userId)
    const isBAdmin: boolean = isAdmin.value(b.userId)
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
})

const isAdmin = computed(
  () => (userId: string) => props.event.admins.includes(userId)
)
const getName = computed(
  () => (userId: string) =>
    store.direct.state.usersCache.users?.get(userId)?.name
)

const getUserIcon = computed(
  () => (userId: string) =>
    store.direct.state.usersCache.users?.get(userId)?.icon
)
const pageLength = computed(() =>
  Math.ceil(validAttendees.value.length / props.attendeesPerPage)
)

const counts = computed(
  () =>
    `参加: ${attendanceCount.value}人, 欠席: ${absentCount.value}人, 未定: ${pendingCount.value}人`
)

const attendeesSlice = computed(() =>
  sortedAttendees.value.slice(
    (page.value - 1) * props.attendeesPerPage,
    page.value * props.attendeesPerPage
  )
)
</script>
