import { useState } from 'react'
import { WordType } from 'store'

export const useWordSelector = ({
  onSelectWord = () => {},
  selectedWords = []
}: {
  onSelectWord?: (word: WordType) => void
  selectedWords?: WordType[]
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  )

  return {
    selectedCategoryId,
    setSelectedCategoryId,
    onSelectWord,
    selectedWords
  }
}

export type WordSelectorType = ReturnType<typeof useWordSelector>
