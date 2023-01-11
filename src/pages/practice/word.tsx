import { ActionType, Row } from 'components'
import { CategoryType, useStore, WordType } from 'store'
import { compareStrings, findLastId } from 'utils'
import { toast } from 'react-toastify'
import { useMemo } from 'react'
import produce from 'immer'
import { HiPlus } from '@react-icons/all-files/hi/HiPlus'
import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'

export const Word = ({
  word,
  categoryWords,
  index,
  category,
  onWordAdded
}: {
  word: WordType
  categoryWords: WordType[]
  index?: number
  category: CategoryType
  onWordAdded: () => void
}) => {
  const isGuessed = useMemo(
    () => !!categoryWords.find((w) => compareStrings(w.text, word.text)),
    [categoryWords, word]
  )

  const onChangeWord = (text: string | undefined) => {
    if (!text) {
      toast.error('Word cannot be empty')
      return
    }

    const practice = useStore.getState().practice

    if (practice.find((w) => w.text === text && w.id !== word.id)) {
      toast.error('Word already exists')
      return
    }

    useStore.setState((state) =>
      produce(state, (draft) => {
        const currentWord = draft.practice.find((w) => w.id === word.id)

        if (!currentWord) return

        currentWord.text = text
      })
    )
  }

  const onAddWord = () => {
    useStore.setState((state) =>
      produce(state, (draft) => {
        draft.words.push({
          id: findLastId(draft.words) + 1,
          text: word.text,
          categoryId: category.id
        })
      })
    )

    setTimeout(() => {
      onWordAdded()
    }, 100)
  }

  const actions: ActionType[] = !isGuessed
    ? [{ icon: HiPlus, title: 'Add to category', onClick: onAddWord }]
    : []

  return (
    <Row
      text={word.text}
      color={isGuessed ? undefined : 'red'}
      onChange={onChangeWord}
      index={index}
      actions={[
        ...actions,
        { icon: FiEdit2, title: 'Edit word', onClick: 'edit' }
      ]}
    />
  )
}
