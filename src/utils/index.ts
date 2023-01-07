export const findLastId = (array: any[]) => {
  if (array.length === 0) return 0
  return Math.max(...array.map((item) => item.id))
}

export const getAverageDelay = (delays: number[]) => {
  const convertedDelays: number[] = []

  if (!delays.length) return 0

  delays.reduce((a, b) => {
    convertedDelays.push(b - a)

    return b
  }, 0)

  return convertedDelays.reduce((a, b) => a + b, 0) / convertedDelays.length
}

export type BetterOrWorse = 'better' | 'worse' | 'same'

// Calculates if the new value is better or worse than the previous one (with a degree of tolerance from 0 to 1)
export const getIsBetterOrWorse = (
  prev: number | undefined,
  next: number | undefined,
  tolerance: number
): BetterOrWorse => {
  if (next === undefined || prev === undefined) return 'same'

  const diff = Math.abs(prev - next) / prev

  if (diff < tolerance) return 'same'
  if (next > prev) return 'better'
  if (next < prev) return 'worse'

  return 'same'
}
