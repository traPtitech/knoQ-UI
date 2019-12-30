import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  breaks: true,
  linkify: true,
})

export const render = (src: string) => md.render(src, {})
