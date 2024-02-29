import { GuessWordType, GuessStats } from 'store'

export type GuessWordWithCount = GuessWordType & {
  count: number
  guessedCount: number
}

export type WordWithAvgDelay = {
  wordId: number
  avgDelay: number
  guessRatio: number
}

export const calculateMultipleDelays = (
  stats: GuessStats[]
): WordWithAvgDelay[] => {
  return stats
    .flatMap((s) => s.words as GuessWordWithCount[])
    .reduce((acc, curr) => {
      const existing = acc.find((a) => a.wordId === curr.wordId) as
        | GuessWordWithCount
        | undefined

      if (!existing)
        return [
          ...acc,
          {
            ...curr,
            delay: curr.delay,
            count: 1,
            guessedCount: curr.guessed ? 1 : 0
          }
        ]

      return [
        ...acc.filter((a) => a.wordId !== curr.wordId),
        {
          ...existing,
          delay: existing.delay + curr.delay,
          count: existing.count ? existing.count + 1 : 1,
          guessedCount: existing.guessedCount + (curr.guessed ? 1 : 0)
        }
      ]
    }, [] as GuessWordWithCount[])
    .map((w) => ({
      wordId: w.wordId,
      avgDelay: w.delay / (w.count || 1),
      guessRatio: w.guessedCount / (w.count || 1)
    }))
}
