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
          <attendance-selector v-else v-model="attendance" />
        </v-col>
      </v-row>
    </v-card-actions>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, ModelSync } from 'vue-property-decorator'
import AttendanceSelector from '@/components/event/AttendanceSelector.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { RequestScheduleScheduleEnum, ResponseUser } from '@/api'

@Component({
  components: {
    AttendanceSelector,
    UserAvatar,
  },
})
export default class AttendanceForm extends Vue {
  @ModelSync('value', 'update', { required: true })
  attendance!: RequestScheduleScheduleEnum | null

  get shouldPostAttendance(): boolean {
    return this.attendance === RequestScheduleScheduleEnum.Pending
  }

  setAttend(): void {
    this.attendance = RequestScheduleScheduleEnum.Attendance
  }

  get me(): ResponseUser {
    return this.$store.direct.state.me!
  }
}
</script>
