export function groupBy<T, S>(f: (v: T) => S, xs: T[]): [S, T[]][] {
  let s: S
  let ret: [S, T[]][] = []
  for (const x of xs) {
    const t = f(x)
    if (!s || s !== t) {
      s = t
      ret.push([t, [x]])
    } else {
      ret[ret.length - 1][1].push(x)
    }
  }
  return ret
}
