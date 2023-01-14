import { useStore } from 'store'
import { useNavigate, useParams } from 'react-router-dom'
import { WordEditor } from './word-editor'
import { Button } from 'components'
import { PageContainer } from 'components/layout/container'

export const WordPage = () => {
  const wordId = useParams<{ id: string }>().id
  const navigate = useNavigate()

  const word = useStore((state) =>
    wordId ? state.words.find((c) => c.id === +wordId) : null
  )

  const words = useStore((state) => state.words)

  if (!word) return null

  const prevWord = words.find((c) => c.id === word.id - 1)
  const nextWord = words.find((c) => c.id === word.id + 1)

  const goToPreviousWord = () => {
    if (!prevWord) return

    navigate(`/word/${prevWord.id}`, { replace: true })
  }

  const goToNextWord = () => {
    if (!nextWord) return

    navigate(`/word/${nextWord.id}`, { replace: true })
  }

  return (
    <PageContainer>
      <div data-test="word-editor">
        <WordEditor height={330} word={word} />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div>
          {prevWord && (
            <Button
              color="gray"
              size="md"
              onClick={goToPreviousWord}
              data-test="btn-prev-word"
            >
              {'Previous Word'}
            </Button>
          )}
        </div>
        <div>
          {nextWord && (
            <Button
              color="gray"
              size="md"
              onClick={goToNextWord}
              data-test="btn-next-word"
            >
              {'Next Word'}
            </Button>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
