import { GuessWordType, GuessStats } from 'store'

type GuessWordWithCount = GuessWordType & { count: number }
type WordWithAvgDelay = { wordId: number; avgDelay: number }

export const calculateMultipleDelays = (
  stats: GuessStats[]
): WordWithAvgDelay[] => {
  return stats
    .flatMap((s) => s.words as GuessWordWithCount[])
    .reduce((acc, curr) => {
      const existing = acc.find((a) => a.wordId === curr.wordId) as
        | GuessWordWithCount
        | undefined

      if (!existing) return [...acc, { ...curr, delay: curr.delay, count: 1 }]

      return [
        ...acc.filter((a) => a.wordId !== curr.wordId),
        {
          ...existing,
          delay: existing.delay + curr.delay,
          count: existing.count ? existing.count + 1 : 1
        }
      ]
    }, [] as GuessWordWithCount[])
    .map((w) => ({ wordId: w.wordId, avgDelay: w.delay / (w.count || 1) }))
}
