import UsersRepository from './usersRepository'
import ReservationsRepository from './reservationsRepository'
import GroupsRepository from './groupsRepository'
import RoomsRepository from './roomsRepository'

const repositories = {
  users: UsersRepository,
  reservations: ReservationsRepository,
  groups: GroupsRepository,
  rooms: RoomsRepository
}

export const RepositoryFactory = {
  set: name => repositories[name]
}
