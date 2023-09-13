import SidebarFooter from '@/components/main/SidebarFooter.vue'

const rules = {
  groupName: [
    (v: string) => !!v || 'グループ名は必須です',
    (v: string) => v.length <= 32 || 'グループ名は32文字までです',
  ],
  groupMembers: [
    (v: string[]) =>
      !!v.length || 'グループには1人以上のメンバーを指定してください',
  ],
  eventName: [
    (v: string) => !!v || 'イベント名は必須です',
    (v: string) => v.length <= 32 || 'イベント名は32文字までです',
  ],
  eventGroup: [(v: string) => !!v || 'グループは必須です'],
  eventAdmins: [
    (v: unknown[]) =>
      !!v.length || 'イベントには1人以上のメンバーを指定してください',
  ],
  eventRoom: [(v: string) => !!v || '進捗部屋を選んでください'],
  eventPlace: [
    (v: string) => !!v || '場所名は必須です',
    (v: string) => v.length <= 32 || '場所名は32文字までです',
  ],
  eventDate: [(v: string) => !!v || '日付は必須です'],
  verifiedRoom: [
    (v: string) => !!v || '進捗部屋の情報を入力してください',
    (v: string) =>
      SidebarFooter.methods?.isValidData(v) || 'データは6列で入力してください',
  ],

  eventTimeStart: (
    endTime: string,
    roomStartTime: string | null,
    roomEndTime: string | null
  ) => [
    (v: string) => !!v || '開始時刻は必須です',
    (v: string) =>
      !endTime || v < endTime || '開始時刻は終了時刻よりも早くしてください',
    (v: string) =>
      (v >= roomStartTime! && v <= roomEndTime!) ||
      '進捗部屋の利用可能な時間を選択してください',
  ],
  eventTimeEnd: (
    startTime: string,
    roomStartTime: string | null,
    roomEndTime: string | null
  ) => [
    (v: string) => !!v || '終了時刻は必須です',
    (v: string) => v > startTime || '終了時刻は開始時刻よりも遅くしてください',
    (v: string) =>
      (v >= roomStartTime! && v <= roomEndTime!) ||
      '進捗部屋の利用可能な時間を選択してください',
  ],
  eventTimeStartInstant: (endTime: string) => [
    (v: string) => !!v || '開始時刻は必須です',
    (v: string) =>
      !endTime || v < endTime || '開始時刻は終了時刻よりも早くしてください',
  ],
  eventTimeEndInstant: (startTime: string) => [
    (v: string) => !!v || '終了時刻は必須です',
    (v: string) => v > startTime || '終了時刻は開始時刻よりも遅くしてください',
  ],
}

export default rules
