const PATH_KEY = 'PATH_KEY'

const PathStorage = {
  saveCurrentPath(): void {
    sessionStorage.setItem(PATH_KEY, window.location.pathname)
  },

  getSavedPath(): string | null {
    return sessionStorage.getItem(PATH_KEY)
  },
}

export default PathStorage
