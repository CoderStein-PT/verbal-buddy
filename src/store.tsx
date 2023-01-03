import create from 'zustand'
import { persist } from 'zustand/middleware'

export type DescriptionType = {
  id: number
  text: string
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
}

export const useStore = create(
  persist<StoreType, [], []>(
    (set) => ({
      categories: [
        { id: 1, name: 'animals' },
        { id: 2, name: 'food' },
        { id: 3, name: 'people' }
      ],
      words: [
        { id: 1, text: 'hello' },
        { id: 2, text: 'world' }
      ],
      practice: [],
      selectedWords: []
    }),
    { name: 'joke-generator' }
  )
)
