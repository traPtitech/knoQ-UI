declare namespace Schemas {
  export interface Room {
    roomId: string
    place: string
    date: string
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
    private: boolean
    timeStart: string
    timeEnd: string
    imageId: string
    roomId: string
    groupId: string
    favorite: boolean
    tags: {
      name: string
      locked: boolean
    }[]
    createdBy: string
    createdAt: string
    updatedAt: string
  }

  export interface Group {
    groupId: string
    name: string
    description: string
    imageId: string
    open: string
    members: string[]
    isTraQGroup: boolean
    createdBy: string
    createdAt: string
    updatedAt: string
  }

  export interface Tag {
    name: string
    official: true
  }

  export interface User {
    userId: string
    name: string
  }

  export interface Me {
    userId: string
    admin: boolean
  }

  export interface Image {
    imageId: string
  }
}
