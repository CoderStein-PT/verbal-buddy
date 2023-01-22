import { useStore, WordType } from 'store'
import { useNavigate, useParams } from 'react-router-dom'
import { WordEditor, PageContainer, useWordEditor } from 'components'
import { Button } from 'ui'
import { TooltipWrapper } from 'react-tooltip'
import { useWordNavigation } from './use-word-navigation'
import { useCallback, useEffect, useMemo } from 'react'
import isHotkey from 'is-hotkey'

export const WordPageCore = ({ word }: { word: WordType }) => {
  const wordEditor = useWordEditor({ length: 3 })
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

  const goToWord = useCallback(
    (word: WordType | undefined) => {
      if (!word) return

      navigate(`/word/${word.id}`, { replace: true })
    },
    [navigate]
  )

  const wordNav = useWordNavigation({
    onLeft: () => goToWord(prevWord),
    onRight: () => goToWord(nextWord)
  })

  const onGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isHotkey(['ctrl+left', 'mod+left'], e)) {
        e.preventDefault()
        navigate(-1)
      }

      if (isHotkey(['mod+right', 'ctrl+right'], e)) {
        navigate(1)
        return
      }
    },
    [navigate]
  )

  useEffect(() => {
    window.addEventListener('keydown', onGlobalKeyDown)

    return () => {
      window.removeEventListener('keydown', onGlobalKeyDown)
    }
  }, [onGlobalKeyDown])

  return (
    <PageContainer>
      <div data-test="word-editor">
        <WordEditor
          height={330}
          word={word}
          wordEditor={wordEditor}
          wordNav={wordNav}
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div>
          {prevWord && (
            <TooltipWrapper content="CTRL+Left">
              <Button
                color="grayPrimary"
                size="md"
                onClick={() => goToWord(prevWord)}
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
                color="grayPrimary"
                size="md"
                onClick={() => goToWord(nextWord)}
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
