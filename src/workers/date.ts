import moment from 'moment'

export const today = () =>
  moment()
    .hour(0)
    .minute(0)
    .second(0)
    .format()
export const todayEnd = () =>
  moment()
    .hour(23)
    .minute(59)
    .second(59)
    .format()

export const formatDate = (fmt?: string) => (date: string) =>
  moment(date).format(fmt)

export const GOOGLE_CALENDER_URL_FORMAT = 'YYYYMMDDTHHmmssZ'
export const DATETIME_DISPLAY_FORMAT = 'ddd M/D, h:mma'
export const DATE_DISPLAY_FORMAT = 'ddd M/D, YYYY'

export const getDate = formatDate('YYYY-MM-DD')
export const getTime = formatDate('HH:mm')
export const getIso8601 = (date: string, time: string) =>
  moment(date + time, 'YYYY-MM-DDHH:mm').format()
