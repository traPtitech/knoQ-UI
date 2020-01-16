import moment from 'moment'

export default {
  FormatGoogle(date, time) {
    date.setHours(parseInt(time.slice(0, 2)))
    date.setMinutes(time.slice(3, 5))
    date = moment(date).add(-9, 'hours')
    return (
      moment(date).format('YYYYMMDD') +
      'T' +
      moment(date).format('HHmmss') +
      'Z'
    )
  },
}
