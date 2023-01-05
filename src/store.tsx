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

export type WordType = {
  id: number
  text: string
  descriptions?: DescriptionType[]
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
}

export type SettingsType = {
  randomWords: number
  practiceMaxWords: number
}

export type StoreType = {
  categories: CategoryType[]
  words: WordType[]
  practice: WordType[]
  selectedWords: WordType[]
  jokes: JokeType[]
  practiceStats: PracticeStatsType[]
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
      settings: {
        randomWords: 3,
        practiceMaxWords: 50
      }
    }),
    { name: 'joke-generator' }
  )
)
