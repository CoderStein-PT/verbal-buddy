import { useStore, WordType } from 'store'
import React, { useEffect } from 'react'

export const useRecursiveWordHeader = (word: WordType) => {
  const [breadcrumbs, setBreadcrumbs] = React.useState<number[]>([word.id])
  const [activeBreadcrumbIndex, setActiveBreadcrumbIndex] = React.useState(0)

  const words = useStore((state) => state.words)

  useEffect(() => {
    setBreadcrumbs([word.id])
    setActiveBreadcrumbIndex(0)
  }, [word.id])

  const activeWord = words.find(
    (w) => w.id === breadcrumbs[activeBreadcrumbIndex]
  )

  const onWordClick = (word: WordType) => {
    const newBreadcrumbs = [
      ...breadcrumbs.slice(0, activeBreadcrumbIndex + 1),
      word.id
    ]
    setBreadcrumbs(newBreadcrumbs)
    setActiveBreadcrumbIndex(newBreadcrumbs.length - 1)
  }

  return {
    breadcrumbs,
    setBreadcrumbs,
    activeBreadcrumbIndex,
    setActiveBreadcrumbIndex,
    activeWord,
    onWordClick
  }
}

export type RecursiveWordType = ReturnType<typeof useRecursiveWordHeader>
