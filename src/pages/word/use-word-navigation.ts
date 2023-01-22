import isHotKey from 'is-hotkey'
import { useCallback, useMemo } from 'react'
import { RecursiveWordType, UseWordEditorType } from 'components'

export type UseWordNavigationType = ReturnType<typeof useWordNavigation>

export const useWordNavigation = ({
  onLeft,
  onRight
}: {
  onLeft?: () => void
  onRight?: () => void
}) => {
  const onKeyDown = useCallback(
    (
      e: React.KeyboardEvent,
      wordEditor?: UseWordEditorType,
      recursiveWord?: RecursiveWordType
    ) => {
      if (!wordEditor || wordEditor.text) return false

      if (
        !!onLeft &&
        isHotKey('left', e) &&
        recursiveWord?.activeBreadcrumbIndex === 0
      ) {
        e.preventDefault()
        onLeft()
        return true
      }

      if (
        !!onRight &&
        isHotKey('right', e) &&
        recursiveWord?.activeBreadcrumbIndex === 0
      ) {
        e.preventDefault()
        onRight()
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
    [onLeft, onRight]
  )

  return useMemo(() => ({ onKeyDown }), [onKeyDown])
}
