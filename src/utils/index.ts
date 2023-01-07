export const findLastId = (array: any[]) => {
  if (array.length === 0) return 0
  return Math.max(...array.map((item) => item.id))
}

export const convertDelays = (delays: number[]) => {
  const convertedDelays: number[] = []

  if (!delays.length) return []

  delays.reduce((a, b) => {
    convertedDelays.push(b - a)

    return b
  }, 0)

  return convertedDelays
}

// if the graph total points number exceeds the maxPoints, it will return a new graph with reduced number of points but with the same shape
export const capGraphPointsFrequency = (
  // the delays is already converted
  delays: number[],
  maxPoints: number
) => {
  if (!delays.length) return []

  const pointsFrequency = Math.ceil(delays.length / maxPoints)

  const cappedDelays: number[] = []

  for (let i = 0; i < delays.length; i += pointsFrequency) {
    const pointsToAverage = delays.slice(i, i + pointsFrequency)
    const average =
      pointsToAverage.reduce((a, b) => a + b, 0) / pointsToAverage.length

    cappedDelays.push(average)
  }

  return cappedDelays
}

export const getAverageDelay = (delays: number[]) => {
  const convertedDelays = convertDelays(delays)

  if (!delays.length) return 0

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
