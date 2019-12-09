declare namespace Params {
  export interface Room {
    roomID?: Schemas.RoomDetail['id']
    date_begin?: Schemas.Date
    date_end?: Schemas.Date
  }

  export interface Event {
    id?: Schemas.EventDetail['id']
    name?: Schemas.EventDetail['name']
    traQID?: Schemas.User['traq_id']
    groupID?: Schemas.EventDetail['group']['id']
    roomID?: Schemas.EventDetail['room']['id']
    date_begin?: Schemas.Date
    date_end?: Schemas.Date
  }

  export interface Group {
    id?: Schemas.GroupDetail['id']
    name?: Schemas.GroupDetail['name']
    traQID?: Schemas.User['traq_id']
  }

  export interface Tag {
    for_room?: Schemas.Tag['for_room']
    for_event?: Schemas.Tag['for_event']
    for_group?: Schemas.Tag['for_group']
  }
}
