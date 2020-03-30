import moment from 'moment'

export const todayStr = moment().format()

// Expected format:
//   date: YYYY-MM-DD
//   time: HH:mm:ss
export const momentify = (date: string, time: string = '00:00') =>
  moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm')

export const formatGoogle = (date, time) => {
  date.setHours(parseInt(time.slice(0, 2)))
  date.setMinutes(time.slice(3, 5))
  date = moment(date).add(-9, 'hours')
  return (
    moment(date).format('YYYYMMDD') + 'T' + moment(date).format('HHmmss') + 'Z'
  )
}

export const compareDateStr = (d1: string, d2?: string) => {
  const m1 = momentify(d1)
  const m2 = d2 ? momentify(d2) : moment()
  return m1.valueOf() - m2.valueOf()
}
