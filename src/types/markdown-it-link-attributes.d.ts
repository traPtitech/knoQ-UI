declare module 'markdown-it-link-attributes' {
  import MarkdowIt from 'markdown-it'

  interface MilaAttrsOption {
    download: string
    hreflang: string
    media: string
    ping: string
    rel: string
    target: string
    type: string
  }

  interface MilaOption {
    pattern?: RegExp
    attrs: MilaAttrsOption
  }

  const mila: (md: MarkdowIt, options?: MilaOption | MilaOption[]) => void
  export default mila
}
