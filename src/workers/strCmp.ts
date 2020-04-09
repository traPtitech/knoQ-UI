const notNull = <T>(x: T | null | undefined): x is T => {
  return x !== null && x !== undefined
}

export function strMax(
  ...strs: (string | null | undefined)[]
): string | undefined {
  if (!strs.length) return undefined
  return strs
    .filter(notNull)
    .reduce((prev, curr) => (curr > prev ? curr : prev))
}

export function strMin(
  ...strs: (string | null | undefined)[]
): string | undefined {
  if (!strs.length) return undefined
  return strs
    .filter(notNull)
    .reduce((prev, curr) => (curr < prev ? curr : prev))
}
