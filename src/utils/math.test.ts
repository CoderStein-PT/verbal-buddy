// test calculateMultipleDelays from app/src/utils/math.ts
import { calculateMultipleDelays } from './math'
import { GuessStats } from 'store'

describe('calculateMultipleDelays', () => {
  it('calculates the average delay for each word', () => {
    const stats: GuessStats[] = [
      {
        id: 1,
        timestamp: 1,
        totalTime: 1,
        avgDelayBetweenWords: 1.5,
        wordsCount: 2,
        words: [
          { wordId: 1, delay: 1 },
          { wordId: 2, delay: 2 }
        ]
      },
      {
        id: 2,
        timestamp: 2,
        totalTime: 1,
        avgDelayBetweenWords: 3.5,
        wordsCount: 2,
        words: [
          { wordId: 1, delay: 2 },
          { wordId: 2, delay: 3 }
        ]
      },
      {
        id: 3,
        timestamp: 3,
        totalTime: 1,
        avgDelayBetweenWords: 3.5,
        wordsCount: 2,
        words: [
          { wordId: 1, delay: 3 },
          { wordId: 2, delay: 4 }
        ]
      }
    ]

    const result = calculateMultipleDelays(stats)

    expect(result).toEqual([
      { wordId: 1, avgDelay: 2 },
      { wordId: 2, avgDelay: 3 }
    ])
  })

  it('a more random test', () => {
    const stats: GuessStats[] = [
      {
        id: 1,
        timestamp: 1,
        totalTime: 1,
        avgDelayBetweenWords: 1.5,
        wordsCount: 2,
        words: [
          { wordId: 1, delay: 1 },
          { wordId: 2, delay: 2 }
        ]
      },
      {
        id: 2,
        timestamp: 2,
        totalTime: 1,
        avgDelayBetweenWords: 2.5,
        wordsCount: 2,
        words: [
          { wordId: 1, delay: 2 },
          { wordId: 2, delay: 3 }
        ]
      },
      {
        id: 3,
        timestamp: 3,
        totalTime: 1,
        avgDelayBetweenWords: 3.5,
        wordsCount: 2,
        words: [
          { wordId: 1, delay: 3 },
          { wordId: 2, delay: 4 },
          { wordId: 3, delay: 12 }
        ]
      },
      {
        id: 4,
        timestamp: 4,
        totalTime: 1,
        avgDelayBetweenWords: 4.5,
        wordsCount: 2,
        words: [
          { wordId: 1, delay: 4 },
          { wordId: 2, delay: 5 }
        ]
      },
      {
        id: 5,
        timestamp: 5,
        totalTime: 1,
        avgDelayBetweenWords: 5.5,
        wordsCount: 2,
        words: [
          { wordId: 1, delay: 5 },
          { wordId: 2, delay: 6 },
          { wordId: 3, delay: 6 }
        ]
      }
    ]

    const result = calculateMultipleDelays(stats)

    expect(result).toEqual([
      { wordId: 1, avgDelay: 3 },
      { wordId: 2, avgDelay: 4 },
      { wordId: 3, avgDelay: 9 }
    ])
  })
})
