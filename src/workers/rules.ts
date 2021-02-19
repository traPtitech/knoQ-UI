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
  eventTimeStart: [(v: string) => !!v || '開始時刻は必須です'],
  eventTimeEnd: [(v: string) => !!v || '終了時刻は必須です'],
}

export default rules
