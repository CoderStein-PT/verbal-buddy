import { useStore, WordType } from 'store'
import { useNavigate, useParams } from 'react-router-dom'
import { WordEditor, PageContainer } from 'components'
import { Button } from 'ui'
import { useCallback, useEffect, useMemo } from 'react'
import { TooltipWrapper } from 'react-tooltip'

export const WordPageCore = ({ word }: { word: WordType }) => {
  const navigate = useNavigate()

  const words = useStore((state) => state.words)

  const prevWord = useMemo(
    () => words.find((c) => c.id === word.id - 1),
    [word, words]
  )

  const nextWord = useMemo(
    () => words.find((c) => c.id === word.id + 1),
    [word, words]
  )

  const goToPreviousWord = useCallback(() => {
    if (!prevWord) return

    navigate(`/word/${prevWord.id}`, { replace: true })
  }, [prevWord, navigate])

  const goToNextWord = useCallback(() => {
    if (!nextWord) return

    navigate(`/word/${nextWord.id}`, { replace: true })
  }, [nextWord, navigate])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPreviousWord()
      }

      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault()
        goToNextWord()
      }

      if (e.key === 'Escape') {
        navigate(-1)
      }
    },
    [navigate, goToPreviousWord, goToNextWord]
  )

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown])

  return (
    <PageContainer>
      <div data-test="word-editor">
        <WordEditor height={330} word={word} />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div>
          {prevWord && (
            <TooltipWrapper content="CTRL+Left">
              <Button
                color="gray"
                size="md"
                onClick={goToPreviousWord}
                data-test="btn-prev-word"
              >
                {'Previous Word'}
              </Button>
            </TooltipWrapper>
          )}
        </div>
        <div>
          {nextWord && (
            <TooltipWrapper content="CTRL+Right">
              <Button
                color="gray"
                size="md"
                onClick={goToNextWord}
                data-test="btn-next-word"
              >
                {'Next Word'}
              </Button>
            </TooltipWrapper>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

export const WordPage = () => {
  const wordId = useParams<{ id: string }>().id

  const word = useStore((state) =>
    wordId ? state.words.find((c) => c.id === +wordId) : null
  )

  if (!word) return null
  return <WordPageCore word={word} />
}
