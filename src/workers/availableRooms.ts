import { getDate } from './date'

interface TimeSpan {
  timeStart: string
  timeEnd: string
}

type DateStr = string
type RoomId = string

// 'events' are being held at 'room'
interface RoomEventTable {
  room: Schemas.Room
  events: Schemas.Event[]
}

export interface AvailableRoom {
  roomId: string
  place: string
  timeStart: string
  timeEnd: string
}

// Remove time span 't2' from 't1'
function differenceTimeSpan(t1: TimeSpan, t2: TimeSpan): TimeSpan[] {
  /* t1 and t2 have no intersection
   *   t1 s###t
   *           &        ->  s###t
   *   t2        u---v
   */
  if (t1.timeStart >= t2.timeEnd || t1.timeEnd <= t2.timeStart) {
    return [t1]
  }

  /* t2 includes t1
   *   t1  s######t
   *           &        ->  empty
   *   t2 u----------v
   */
  if (t2.timeStart <= t1.timeStart && t2.timeEnd >= t1.timeEnd) {
    return []
  }

  /* t1 includes t2
   *   t1 s##########t
   *           &        ->  s#u   v###t
   *   t2   u---v
   */
  if (t1.timeStart < t2.timeStart && t1.timeEnd > t2.timeEnd) {
    return [
      { timeStart: t1.timeStart, timeEnd: t2.timeStart },
      { timeStart: t2.timeEnd, timeEnd: t1.timeEnd },
    ]
  }

  /* t1 and t2 have intersection
   *   t1 s######t
   *          &         ->  s###u
   *   t2     u----v
   *
   *   t1   s######t
   *          &         ->  v###t
   *   t2 u----v
   */
  if (t1.timeStart < t2.timeStart && t1.timeEnd < t2.timeEnd) {
    return [{ timeStart: t1.timeStart, timeEnd: t2.timeStart }]
  }
  if (t1.timeStart > t2.timeStart && t1.timeEnd > t2.timeEnd) {
    return [{ timeStart: t2.timeEnd, timeEnd: t1.timeEnd }]
  }
}

function createRoomEventTables(
  rooms: Schemas.Room[],
  events: Schemas.Event[]
): Map<DateStr, Map<RoomId, RoomEventTable>> {
  const roomEventMap = new Map<DateStr, Map<RoomId, RoomEventTable>>()
  for (const room of rooms) {
    const date = getDate(room.timeStart)
    if (!roomEventMap.has(date)) {
      roomEventMap.set(date, new Map())
    }
    roomEventMap.get(date).set(room.roomId, { room, events: [] })
  }
  for (const event of events) {
    roomEventMap
      .get(getDate(event.timeStart))
      ?.get(event.roomId)
      ?.events.push(event)
  }
  return roomEventMap
}

function calcAvailableTimeSpansOfRoom(
  { room, events }: RoomEventTable,
  sharedRoom: boolean
): TimeSpan[] {
  let availableTSs: TimeSpan[] = [
    { timeStart: room.timeStart, timeEnd: room.timeEnd },
  ]
  for (const event of events) {
    if (sharedRoom && event.sharedRoom) {
      continue
    }
    availableTSs = availableTSs.flatMap(t1 =>
      differenceTimeSpan(t1, {
        timeStart: event.timeStart,
        timeEnd: event.timeEnd,
      })
    )
  }
  return availableTSs
}

export function calcAvailableRooms(
  rooms: Schemas.Room[],
  events: Schemas.Event[]
) {
  const roomEventTables = createRoomEventTables(rooms, events)

  return (dates: string[], sharedRoom: boolean): AvailableRoom[] => {
    const roomEventsOnDates = dates.flatMap(date => [
      ...(roomEventTables.get(date)?.values() ?? []),
    ])
    return roomEventsOnDates.flatMap(tables => {
      const availableTSs = calcAvailableTimeSpansOfRoom(tables, sharedRoom)
      return availableTSs.map(timeSpan => ({
        ...timeSpan,
        roomId: tables.room.roomId,
        place: tables.room.place,
      }))
    })
  }
}
