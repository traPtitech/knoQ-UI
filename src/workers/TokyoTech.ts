function isTitechRoom(room: string): boolean {
  return /^[SWHMI]\d{3}$/g.test(room)
}

function calcRoomPdfUrl(room: string): string {
  const DISTRICTS = {
    S: 'minami',
    W: 'nisi',
    H: 'honkan',
    M: 'midori',
    I: 'ishikawa',
  }

  const district = DISTRICTS[room[0]]
  return `https://www.titech.ac.jp/enrolled/facilities/rooms/pdf/picture/${district}/${room}.pdf`
}

export { isTitechRoom, calcRoomPdfUrl }
