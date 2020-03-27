export interface State {
  me: Schemas.User | null
}

export const state = (): State => ({
  me: null,
})
