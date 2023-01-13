import { PresetType } from 'presets/types'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export type DescriptionType = {
  id: number
  text: string
}

export type PremiseType = {
  id: number
  text: string
}

export type JokeType = {
  id: number
  text: string
  wordIds?: number[]
  draftText?: string
  premises?: PremiseType[]
}

export type JournalEntryType = {
  id: number
  title: string
  text: string
  createdAt: string
  updatedAt: string
}

export type RelatedWordType = {
  id: number
  wordId: number
}

export type WordType = {
  id: number
  text: string
  descriptions?: DescriptionType[]
  opposites?: DescriptionType[]
  relatedWords?: RelatedWordType[]
  categoryId?: number
}

export type CategoryType = {
  id: number
  name: string
}

export type PracticeStatsType = {
  categoryId: number
  timestamp: number
  delay: number
  avgDelayBetweenWords: number
  wordsCount: number
  incorrectWordsCount: number
  delays: number[]
}

export type GuessDelayType = {
  delay: number
  word: WordType
  guessed?: boolean
}

export type GuessStats = {
  categoryIds?: number[]
  timestamp: number
  totalTime: number
  avgDelayBetweenWords: number
  wordsCount: number
  delays: GuessDelayType[]
}

export type SettingsType = {
  randomWords: number
  practiceMaxWords: number
  myPresets: PresetType[]
  practiceDelayTolerance: number
  practiceCountdown: number
  practiceStartRightAway: boolean
  guessMaxWords: number
}

export type StoreType = {
  categories: CategoryType[]
  words: WordType[]
  practice: WordType[]
  selectedWords: WordType[]
  journal: JournalEntryType[]
  jokes: JokeType[]
  practiceStats: PracticeStatsType[]
  guessStats: GuessStats[]
  settings: SettingsType
}

export const useStore = create(
  persist<StoreType, [], [], null>(
    (set) => ({
      categories: [],
      words: [],
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
        practiceCountdown: 3,
        practiceStartRightAway: false,
        guessMaxWords: 10
      }
    }),
    { name: 'joke-generator', version: 1 }
  )
)
