import { useStore } from 'store'
import { useParams } from 'react-router-dom'
import { WordEditor } from './word-editor'

export const WordPage = () => {
  const wordId = useParams<{ id: string }>().id

  const word = useStore((state) =>
    wordId ? state.words.find((c) => c.id === +wordId) : null
  )

  if (!word) return null

  return <WordEditor word={word} />
}
