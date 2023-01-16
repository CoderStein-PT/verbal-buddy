import { useStore, WordType } from 'store'
import { useNavigate } from 'react-router-dom'
import isHotKey from 'is-hotkey'
import { useCallback, useEffect, useMemo } from 'react'
import { RecursiveWordType, UseWordEditorType } from 'components'

export type UseWordNavigationType = ReturnType<typeof useWordNavigation>

export const useWordNavigation = ({ word }: { word: WordType }) => {
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

  const onGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isHotKey(['ctrl+left', 'mod+left'], e)) {
        e.preventDefault()
        navigate(-1)
      }

      if (isHotKey(['mod+right', 'ctrl+right'], e)) {
        navigate(1)
        return
      }
    },
    [navigate]
  )

  const onKeyDown = useCallback(
    (
      e: React.KeyboardEvent,
      wordEditor?: UseWordEditorType,
      recursiveWord?: RecursiveWordType
    ) => {
      if (!wordEditor) return false

      if (isHotKey('left', e) && recursiveWord?.activeBreadcrumbIndex === 0) {
        e.preventDefault()
        goToPreviousWord()
        return true
      }

      if (isHotKey('right', e) && recursiveWord?.activeBreadcrumbIndex === 0) {
        e.preventDefault()
        goToNextWord()
        return true
      }

      if (isHotKey('opt+left', e)) {
        e.preventDefault()
        wordEditor.selectPrev()
        return true
      }

      if (isHotKey('opt+right', e)) {
        e.preventDefault()
        wordEditor.selectNext()
        return true
      }

      return false
    },
    [goToPreviousWord, goToNextWord]
  )

  useEffect(() => {
    window.addEventListener('keydown', onGlobalKeyDown)

    return () => {
      window.removeEventListener('keydown', onGlobalKeyDown)
    }
  }, [onGlobalKeyDown])

  return useMemo(
    () => ({
      goToPreviousWord,
      goToNextWord,
      prevWord,
      nextWord,
      onKeyDown
    }),
    [goToPreviousWord, goToNextWord, prevWord, nextWord, onKeyDown]
  )
}
