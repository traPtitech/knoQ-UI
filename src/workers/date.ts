import moment from 'moment'

export const momentify = (date: string, time: string = '00:00') =>
  moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm')

export const GCAL_FORMAT = 'YYYYMMDDTHHmmssZ'
export const DISP_FORMAT = 'MMM D, h:mma'

export const compareDateStr = (d1: string, d2?: string) => {
  const m1 = momentify(d1)
  const m2 = d2 ? momentify(d2) : moment()
  return m1.valueOf() - m2.valueOf()
}

export const getDateStr = (iso8601: string) => iso8601.slice(0, 10)
export const getTimeStr = (iso8601: string) => iso8601.slice(11, 16)
export const getIso8601 = (date: string, time: string) =>
  `${date}T${time}:00+09:00`

export const utcToJst = (date: string) => moment(date).format()
export const jstToUtc = (date: string) => moment(date).format()
