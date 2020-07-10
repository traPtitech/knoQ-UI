import moment from 'moment'

export const today = () => moment().startOf('day').format()
export const todayEnd = () => moment().endOf('day').format()

export const formatDate = (fmt?: string) => (date: string) =>
  moment(date).format(fmt)

export const GOOGLE_CALENDER_URL_FORMAT = 'YYYYMMDDTHHmmssZ'
export const DATETIME_DISPLAY_FORMAT = 'ddd M/D, h:mma'
export const DATE_DISPLAY_FORMAT = 'ddd M/D, YYYY'
export const TIME_DISPLAY_FORMAT = 'h:mm a'

export const getDate = formatDate('YYYY-MM-DD')
export const getTime = formatDate('HH:mm')
export const getIso8601 = (date: string, time: string) =>
  moment(date + time, 'YYYY-MM-DDHH:mm').format()
