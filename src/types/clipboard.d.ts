declare module '@cloudcmd/clipboard' {
  const e: Pick<typeof navigator.clipboard, 'readText' | 'writeText'>
  export default e
}
