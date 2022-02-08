<template>
  <v-select
    v-model="attendance"
    :items="items"
    :value="attendance"
    solo
    flat
    :background-color="backgroundOf(attendance)"
    hide-details
  >
    <template #selection="{ item }">
      <span :class="`${foregroundOf(attendance)} font-weight-medium`">{{
        item.text
      }}</span>
    </template>
    <template #item="{ item, on, attrs }">
      <v-list-item v-bind="attrs" :active-class="undefined" v-on="on">
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

  foregroundOf(attendance: RequestScheduleScheduleEnum): string {
    return {
      [RequestScheduleScheduleEnum.Pending]: 'blue-grey--text text--darken-1',
      [RequestScheduleScheduleEnum.Absent]: 'white--text',
      [RequestScheduleScheduleEnum.Attendance]: 'white--text',
    }[attendance]
  }

  backgroundOf(attendance: RequestScheduleScheduleEnum): string {
    return {
      [RequestScheduleScheduleEnum.Pending]: '#ced6d7',
      [RequestScheduleScheduleEnum.Absent]: '#d3664f',
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
