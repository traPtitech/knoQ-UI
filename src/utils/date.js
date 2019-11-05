import moment from 'moment'

export default{
  formatEnglishMonths (num) {
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December'
    ]
    return months[num]
  },

  formatEnglishDays (num) {
    let r
    switch (num) {
    case 1:
      r = '1st'
      break
    case 2:
      r = '2nd'
      break
    case 3:
      r = '3rd'
      break
    default:
      r = num + 'th'
    }
    return r
  },

  FormatGoogle (date, time) {
    date.setHours(parseInt(time.slice(0, 2)))
    date.setMinutes(time.slice(3, 5))
    date = moment(date).add(-9, 'hours')
    return moment(date).format('YYYYMMDD') + 'T' + moment(date).format('HHmmss') + 'Z'
  }
}
