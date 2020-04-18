import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import mila from 'markdown-it-link-attributes'

function highlight(code: string, lang: string): string {
  const result = hljs.getLanguage(lang)
    ? hljs.highlight(lang, code)
    : hljs.highlightAuto(code)
  return result.value
}

const md = new MarkdownIt({
  breaks: true,
  linkify: true,
  highlight,
})

md.use(mila, {
  attrs: {
    target: '_blank',
    rel: 'nofollow noopener noreferer',
  },
})

export const render = (src: string) => md.render(src)
