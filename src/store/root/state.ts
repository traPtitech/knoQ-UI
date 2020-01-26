export interface State {
  me: Schemas.Me
}

export const state = (): State => ({
  me: null,
})
