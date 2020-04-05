import EventsRepository from '@/repositories/eventsRepository'
import GroupsRepository from '@/repositories/groupsRepository'
import RoomsRepository from '@/repositories/roomsRepository'
import TagsRepository from '@/repositories/tagsRepository'
import UsersRepository from '@/repositories/usersRepository'

const repositories = {
  events: EventsRepository,
  groups: GroupsRepository,
  rooms: RoomsRepository,
  users: UsersRepository,
  tags: TagsRepository,
}

type Repositories = typeof repositories
type RepoName = keyof Repositories

const RepositoryFactory = {
  get<T extends RepoName>(name: T): Repositories[T] {
    return repositories[name]
  },
}

export default RepositoryFactory
