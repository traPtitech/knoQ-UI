import UsersRepository from './usersRepository'
import GroupsRepository from './groupsRepository'
import RoomsRepository from './roomsRepository'

const repositories = {
  users: UsersRepository,
  groups: GroupsRepository,
  rooms: RoomsRepository,
}

type Repositories = typeof repositories
type RepoName = keyof Repositories

export const RepositoryFactory = {
  get: <T extends RepoName>(name: T): Repositories[T] => repositories[name],
}
