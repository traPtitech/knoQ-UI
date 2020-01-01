export default {
  groupNameRules: [v => !!v || 'Group name is required'],
  groupMembersRules: [
    v => v.length > 0 || 'You must specify one or more members',
  ],
}
