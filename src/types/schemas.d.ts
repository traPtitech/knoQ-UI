declare namespace Schemas {
  // type aliases
  export type Time = string
  export type Date = string
  export type DateTime = string

  export interface RoomDetail {
    id: number
    place: string
    date: Date
    time_start: Time
    time_end: Time
    created_at: DateTime
    updated_at: DateTime
    tags: (Tag & { locked: boolean })[]
    available_time: {
      time_start: Time
      time_end: Time
    }[]
  }

  export interface Event {
    name: string
    description: string
    allow_together: string
    time_start: Time
    time_end: Time
    tags: (Tag['name'] & { locked: boolean })[]
    room_id: number
    group_id: number
  }

  export interface EventDetail {
    id: number
    name: string
    description: string
    allow_together: string
    time_start: Time
    time_end: Time
    tags: (Tag & { locked: boolean })[]
    group: GroupDetail
    room: RoomDetail
    created_by: User['traq_id']
    created_at: DateTime
    updated_at: DateTime
  }

  export interface Group {
    name: string
    description: string
    join_freely: boolean
    members: { traq_id: User['traq_id'] }[]
    tags: (Tag['name'] & { locked: boolean })[]
  }

  export interface GroupDetail {
    id: number
    name: string
    description: string
    join_freely: string
    members: User[]
    tags: (Tag & { locked: boolean })[]
    created_by: User['traq_id']
    created_at: DateTime
    updated_at: DateTime
  }

  export interface Tag {
    id: number
    name: string
    official: boolean
    for_room: boolean
    for_group: boolean
    for_event: boolean
  }

  export interface User {
    traq_id: string
  }

  export interface Me extends User {
    admin: boolean
  }
}
