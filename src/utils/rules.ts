export default {
  groupName: [(v: string) => !!v || 'Group name is required'],
  groupMembers: [
    (v: string) => v.length > 0 || 'You must specify one or more members',
  ],
  eventName: [(v: string) => !!v || 'Name is required'],
  eventGroup: [(v: string) => !!v || 'Group is required'],
  eventRoom: [(v: string) => !!v || 'Room is required'],
}
