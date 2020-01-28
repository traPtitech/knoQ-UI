export interface State {
  me: Schemas.Me | null
}

export const state = (): State => ({
  me: null,
})
