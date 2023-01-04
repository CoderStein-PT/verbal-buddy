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

export type StoreType = {
  categories: CategoryType[]
  words: WordType[]
  practice: WordType[]
  selectedWords: WordType[]
  jokes: JokeType[]
  jokeDraft: Omit<JokeType, 'id'>
}

export const useStore = create(
  persist<StoreType, [], []>(
    (set) => ({
      categories: [],
      words: [],
      practice: [],
      selectedWords: [],
      jokes: [],
      jokeDraft: {
        text: '',
        premises: [],
        draftText: '',
        wordIds: []
      }
    }),
    { name: 'joke-generator' }
  )
)
