const rules = {
  groupName: [(v: string) => !!v || 'Group name is required'],
  groupMembers: [
    (v: string[]) => !!v.length || 'You must specify one or more members',
  ],
  eventName: [(v: string) => !!v || 'Name is required'],
  eventGroup: [(v: string) => !!v || 'Group is required'],
  eventRoom: [(v: string) => !!v || 'Room is required'],
  eventPlace: [(v: string) => !!v || 'Place is required'],
  eventDate: [(v: string) => !!v || 'Date is required'],
  eventTimeStart: [(v: string) => !!v || 'TimeStart is required'],
  eventTimeEnd: [(v: string) => !!v || 'TimeEnd is required'],
}

export default rules
