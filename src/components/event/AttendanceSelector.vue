<template>
  <v-select
    v-model="attendance"
    :items="items"
    :value="attendance"
    solo
    flat
    :background-color="colorOfAttendance(attendance)"
    color="white"
    hide-details
  >
    <template #selection="{ item }">
      <span class="white--text font-weight-medium">{{ item.text }}</span>
    </template>
    <template #item="{ item, on, attrs }">
      <v-list-item
        v-bind="attrs"
        :color="colorOfAttendance(item.value)"
        v-on="on"
      >
        {{ item.text }}
      </v-list-item>
    </template>
  </v-select>
</template>

<script lang="ts">
import { RequestScheduleScheduleEnum } from '@/api'
import Vue from 'vue'
import { Component, ModelSync } from 'vue-property-decorator'

@Component
export default class AttendanceSelector extends Vue {
  @ModelSync('value', 'update', { type: String, required: true })
  attendance!: RequestScheduleScheduleEnum

  items: { text: string; value: RequestScheduleScheduleEnum }[] = [
    {
      text: '未定',
      value: RequestScheduleScheduleEnum.Pending,
    },
    {
      text: '欠席予定',
      value: RequestScheduleScheduleEnum.Absent,
    },
    {
      text: '出席予定',
      value: RequestScheduleScheduleEnum.Attendance,
    },
  ]

  colorOfAttendance(attendance: RequestScheduleScheduleEnum): string {
    return {
      [RequestScheduleScheduleEnum.Pending]: 'pending',
      [RequestScheduleScheduleEnum.Absent]: 'secondary',
      [RequestScheduleScheduleEnum.Attendance]: 'primary',
    }[attendance]
  }
}
</script>

<style lang="scss">
::v-deep .v-select__selections input {
  width: 0;
}
</style>
