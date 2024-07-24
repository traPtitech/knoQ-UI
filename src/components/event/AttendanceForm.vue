<template>
  <v-sheet outlined rounded>
    <v-card-title>自分の参加予定</v-card-title>
    <v-card-subtitle v-if="shouldPostAttendance" class="red--text">
      自分の参加予定を入力して下さい
    </v-card-subtitle>
    <v-card-actions>
      <v-row>
        <v-col>
          <user-avatar :user-id="me.userId" :user-icon="me.icon" :size="'36'" />
          {{ me.name }}
        </v-col>
        <v-spacer />
        <v-col>
          <v-btn
            v-if="!attendance"
            large
            outlined
            depressed
            block
            color="primary"
            @click="setAttend"
          >
            出席する
          </v-btn>
          <attendance-selector
            v-else
            :attendance="attendance"
            @change="v => emits('change', v)"
          />
        </v-col>
      </v-row>
    </v-card-actions>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AttendanceSelector from '@/components/event/AttendanceSelector.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { RequestScheduleScheduleEnum } from '@/api'
import { useStore } from '@/workers/store'

const store = useStore()

const props = defineProps<{
  attendance: RequestScheduleScheduleEnum | null
}>()
const emits = defineEmits<{
  (e: 'change', value: RequestScheduleScheduleEnum): void
}>()

const shouldPostAttendance = computed(
  () => props.attendance === RequestScheduleScheduleEnum.Pending
)

const setAttend = () => {
  emits('change', RequestScheduleScheduleEnum.Attendance)
}

const me = store.direct.state.me!
</script>
