const notEmpty = <T>(x: T | null | undefined): x is T => {
  return !!x
}

export function strMax(...strs: (string | null | undefined)[]): string | null {
  const nonEmp = strs.filter(notEmpty)
  if (!nonEmp.length) return null
  return nonEmp.reduce((prev, curr) => (curr > prev ? curr : prev))
}

export function strMin(...strs: (string | null | undefined)[]): string | null {
  const nonEmp = strs.filter(notEmpty)
  if (!nonEmp.length) return null
  return nonEmp.reduce((prev, curr) => (curr < prev ? curr : prev))
}
