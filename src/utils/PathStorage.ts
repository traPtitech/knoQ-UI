const pathKey = 'path'

export default {
  saveCurrentPath(): void {
    sessionStorage.setItem(pathKey, location.pathname)
  },

  getSavedPath(): string {
    return sessionStorage.getItem(pathKey)
  },
}
