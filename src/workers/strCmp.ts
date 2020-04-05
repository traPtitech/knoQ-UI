export function strMax(
  ...strs: (string | null | undefined)[]
): string | undefined {
  if (!strs.length) return undefined
  return strs
    .filter(str => str !== null && str !== undefined)
    .reduce((prev, curr) => (curr > prev ? curr : prev))
}

export function strMin(
  ...strs: (string | null | undefined)[]
): string | undefined {
  if (!strs.length) return undefined
  return strs
    .filter(str => str !== null && str !== undefined)
    .reduce((prev, curr) => (curr < prev ? curr : prev))
}
