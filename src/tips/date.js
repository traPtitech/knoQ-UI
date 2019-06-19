
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
  }
}
