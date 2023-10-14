const beforeUnloadListener = (event: BeforeUnloadEvent) => {
  event.preventDefault()
  event.returnValue =
    '入力されたデータは送信されないまま破棄されますが，よろしいですか。'
}

export function useDraftConfirmer(): void {
  window.addEventListener('beforeunload', beforeUnloadListener)
}

export function removeDraftConfirmer(): void {
  window.removeEventListener('beforeunload', beforeUnloadListener)
}
