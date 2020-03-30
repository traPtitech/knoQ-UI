const pathKey = 'path'

export default {
  saveCurrentPath(): void {
    sessionStorage.setItem(pathKey, window.location.pathname)
  },

  getSavedPath(): string {
    return sessionStorage.getItem(pathKey)
  },
}
