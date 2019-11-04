export default {
  searchRoom (room) {
    const initial = room.charAt()
    let building
    switch (initial) {
    case 'S': building = 'minami'
      break
    case 'W': building = 'nisi'
      break
    case 'H': building = 'honkan'
      break
    case 'M': building = 'midori'
      break
    case 'I': building = 'isikawa'
      break
    default: console.log('error')
    }
    const link = 'https://www.titech.ac.jp/enrolled/facilities/rooms/pdf/picture/' + building + '/' + room + '.pdf'
    return link
  }
}
