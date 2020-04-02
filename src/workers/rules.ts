const rules = {
  groupName: [(v: string) => !!v || 'グループ名は必須です'],
  groupMembers: [
    (v: string[]) =>
      !!v.length || 'グループには1人以上のメンバーを指定してください',
  ],
  eventName: [(v: string) => !!v || 'イベント名は必須です'],
  eventGroup: [(v: string) => !!v || 'グループは必須です'],
  eventRoom: [(v: string) => !!v || '進捗部屋を選んでください'],
  eventPlace: [(v: string) => !!v || '場所名は必須です'],
  eventDate: [(v: string) => !!v || '日付は必須です'],
  eventTimeStart: [(v: string) => !!v || '開始時刻は必須です'],
  eventTimeEnd: [(v: string) => !!v || '終了時刻は必須です'],
}

export default rules
