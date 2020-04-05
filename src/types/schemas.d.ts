declare namespace Schemas {
  export interface Room {
    roomId: string
    place: string
    timeStart: string
    timeEnd: string
    public: boolean
    availableTime: {
      timeStart: string
      timeEnd: string
    }[]
    createdBy: string
    createdAt: string
    updatedAt: string
  }

  export interface Event {
    eventId: string
    name: string
    description: string
    sharedRoom: boolean
    timeStart: string
    timeEnd: string
    roomId: string
    groupId: string
    tags: { name: string }[]
    createdBy: string
    createdAt: string
    updatedAt: string
  }

  export interface Group {
    groupId: string
    name: string
    description: string
    open: boolean
    members: string[]
    isTraQGroup: boolean
    createdBy: string
    createdAt: string
    updatedAt: string
  }

  export interface Tag {
    name: string
  }

  export interface User {
    userId: string
    admin: boolean
    name: string
  }

  export interface AuthParams {
    clientId: string
    state: string
    codeChallenge: string
  }
}
