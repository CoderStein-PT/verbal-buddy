import { PresetType } from 'presets/types'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export type WordPropType = {
  id: number
  text?: string
  wordId?: number
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

export type WordType = {
  id: number
  text: string
  definitions?: WordPropType[]
  opposites?: WordPropType[]
  props?: WordPropType[]
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

export type GuessWordType = {
  delay: number
  wordId: number
  guessed?: boolean
}

export type GuessStats = {
  id: number
  categoryIds?: number[]
  timestamp: number
  totalTime: number
  avgDelayBetweenWords: number
  wordsCount: number
  words: GuessWordType[]
}

export type SettingsType = {
  randomWords: number
  practiceMaxWords: number
  myPresets: PresetType[]
  practiceDelayTolerance: number
  practiceCountdown: number
  practiceStartRightAway: boolean
  guessMaxWords: number
  /**
   * Whether to pronounce definitions when guessing
   */
  guessPronounceDefinitions: boolean
  /**
   * voiceURI of the selected voice
   */
  voice: string | null
  /**
   * Language code for speech recognition based on BCP 47 (e.g. en-US)
   */
  speechRecognitionLang: string
  /**
   * Whether to use speech recognition
   */
  useSpeechRecognition: boolean
  /**
   * Whether to use fast mode.
   * normal - only send the word when the user presses enter
   * single - say multiple words (or write them separated by a comma) and they'll be sent separately.
   * multiple - say a phrase and it will send the whole phrase
   */
  inputMode: 'normal' | 'single' | 'multiple'
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
  deleteWord: (id: number) => void
  deleteCategory: (id: number) => void
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
        guessMaxWords: 10,
        guessPronounceDefinitions: false,
        voice: null,
        speechRecognitionLang: 'en-US',
        useSpeechRecognition: false,
        inputMode: 'normal'
      },
      deleteWord: (id: number) => {
        set((s) => ({
          words: s.words
            .filter((w) => w.id !== id)
            .map((w) => ({
              ...w,
              definitions: w.definitions?.filter((d) => d.wordId !== id),
              opposites: w.opposites?.filter((d) => d.wordId !== id),
              props: w.props?.filter((d) => d.wordId !== id)
            }))
        }))
      },
      deleteCategory: (id: number) => {
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
          words: s.words.filter((w) => w.categoryId !== id)
        }))
      }
    }),
    {
      name: 'verbal-content',
      version: 2
    }
  )
)

if (window.Cypress) {
  window.store = useStore
}
