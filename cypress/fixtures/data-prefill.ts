import { StoreType } from 'store'
import data from './data.json'

export const dataPrefill: StoreType = {
  categories: [
    ...data.categories.map((c, idx) => ({ id: idx + 1, name: c.name }))
  ],
  words: [
    ...data.categories.flatMap((c, idx) =>
      c.words.map((w, idx2) => ({
        id: idx2 + 1 + idx * 100,
        categoryId: idx + 1,
        definitions: w.definitions.map((d, idx3) => ({
          id: idx3 + 1 + idx2 * 100 + idx * 1000,
          text: d
        })),
        opposites: w.opposites.map((o, idx3) => ({
          id: idx3 + 1 + idx2 * 100 + idx * 1000,
          text: o
        })),
        text: w.name
      }))
    )
  ],
  practice: [],
  selectedWords: [],
  jokes: [],
  practiceStats: [],
  guessStats: [],
  journal: [],
  settings: {
    randomWords: 3,
    practiceMaxWords: 10,
    myPresets: [],
    practiceDelayTolerance: 1,
    practiceCountdown: 1,
    practiceStartRightAway: false,
    guessMaxWords: 10
  }
}
