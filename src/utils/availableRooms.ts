interface TimeRange {
  timeStart: string
  timeEnd: string
}

type DateRoomIdMap<T> = Map</* date */ string, Map</* roomId */ string, T>>
type RoomMap = DateRoomIdMap<Schemas.Room>
type EventMap = DateRoomIdMap<{
  shared: Schemas.Event[]
  notShared: Schemas.Event[]
}>

export interface AvailableRoom {
  roomId: string
  place: string
  timeStart: string
  timeEnd: string
}

// Remove time range 't2' from 't1'
// TODO: Make more readable
function differenceTimeRange(t1: TimeRange, t2: TimeRange): TimeRange[] {
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

function calcAvailableTimeRanges(
  notUsed: TimeRange[],
  used: TimeRange[]
): TimeRange[] {
  return used.reduce(
    (prev, t2) => prev.flatMap(t1 => differenceTimeRange(t1, t2)),
    notUsed
  )
}

function createRoomMap(rooms: Schemas.Room[]): RoomMap {
  const roomMap: RoomMap = new Map()
  rooms.forEach(room => {
    // Expected date format: YYYY-MM-DDTHH:mm:ssZ (ISO8601)
    const date = room.timeStart.slice(0, 10)
    if (!roomMap.has(date)) {
      roomMap.set(date, new Map())
    }
    roomMap.get(date).set(room.roomId, room)
  })
  return roomMap
}

function createEventMap(events: Schemas.Event[]): EventMap {
  const eventMap: EventMap = new Map()
  events.forEach(event => {
    // Expected date format: YYYY-MM-DDTHH:mm:ssZ (ISO8601)
    const date = event.timeStart.slice(0, 10)
    if (!eventMap.has(date)) {
      eventMap.set(
        date,
        new Map([[event.roomId, { shared: [], notShared: [] }]])
      )
    }
    eventMap
      .get(date)
      .get(event.roomId)
      [event.sharedRoom ? 'shared' : 'notShared'].push(event)
  })
  return eventMap
}

function calcAvailableRooms(rooms: Schemas.Room[], events: Schemas.Event[]) {
  const roomMap = createRoomMap(rooms)
  const eventMap = createEventMap(events)

  return (dates: string[], sharedRoom: boolean): AvailableRoom[] => {
    function calcAvailableRoomsOnDate(date: string): AvailableRoom[] {
      const roomsOnDate = roomMap.get(date)
      const eventsOnDate = eventMap.get(date)

      // Return empty if we have no room on given date
      if (!roomsOnDate) return []
      return [...roomsOnDate.values()].flatMap(room => {
        // Return room if we have no event at given room on given date
        if (!eventsOnDate) return room
        const { shared, notShared } = eventsOnDate.get(room.roomId)
        const availableTRs = sharedRoom
          ? calcAvailableTimeRanges([room], notShared)
          : calcAvailableTimeRanges([room], [...shared, ...notShared])
        return availableTRs.map(timeRange => ({ ...room, ...timeRange }))
      })
    }
    return dates.flatMap(calcAvailableRoomsOnDate)
  }
}

export { calcAvailableRooms }
