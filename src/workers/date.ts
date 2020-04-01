import moment from 'moment'

export const GCAL_FORMAT = 'YYYYMMDDTHHmmssZ'
export const DATETIME_FORMAT = 'ddd M/D, h:mma'
export const DATE_FORMAT = 'ddd M/D, YYYY'

export const getDateStr = (iso8601: string) => iso8601.slice(0, 10)
export const getTimeStr = (iso8601: string) => iso8601.slice(11, 16)
export const getIso8601 = (date: string, time: string) =>
  `${date}T${time}:00+09:00`

export const utcToJst = (date: string) => moment(date).format()
export const jstToUtc = (date: string) => moment(date).format()
