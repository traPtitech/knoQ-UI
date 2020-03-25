import MarkdownIt from 'markdown-it'
import hljs from 'highlightjs'

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

export const render = (src: string) => md.render(src)
