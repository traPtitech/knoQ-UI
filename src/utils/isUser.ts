function isUser(name: string): boolean {
  return !/^(BOT|Webhook|traP)/.test(name)
}

export { isUser }
