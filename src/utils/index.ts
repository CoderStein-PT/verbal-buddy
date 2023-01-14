import { useRef } from 'react'
import { WordType } from 'store'

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

export const getRandomWord = ({ words }: { words: WordType[] }) => {
  const randomIndex = Math.floor(Math.random() * words.length)

  return words[randomIndex]
}

export const compareStrings = (a: string, b: string) => {
  const aNormalized = a.toLowerCase().replace(/[- ]/g, '')
  const bNormalized = b.toLowerCase().replace(/[- ]/g, '')

  return aNormalized === bNormalized
}

export const isMobile = () => window.innerWidth < 768

export const useRefs = () => {
  const refs = useRef<Record<string, HTMLElement | null>>({})

  const setRefFromKey = (key: string) => (element: HTMLElement | null) => {
    refs.current[key] = element
  }

  return { refs: refs.current, setRefFromKey }
}

export const shuffleArray = (array: any[]) => {
  return [...array].sort(() => 0.5 - Math.random())
}

export const environment = import.meta.env.MODE

export * from './math'
