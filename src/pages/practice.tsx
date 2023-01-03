import { Button, Input, Text } from 'components'
import { useStore, WordType } from 'store'
import { findLastId } from 'utils'
import { toast } from 'react-toastify'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

const ProgressBar = ({
  wordsLeft,
  wordsTotal
}: {
  wordsLeft: number
  wordsTotal: number
}) => {
  return (
    <div className="flex items-center">
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${(wordsLeft / wordsTotal) * 100}%` }}
        />
      </div>
      <div className="ml-2 text-xs font-semibold text-gray-700">
        <Text>
          {wordsLeft}/{wordsTotal}
        </Text>
      </div>
    </div>
  )
}

export const Word = ({ word }: { word: WordType }) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onDeleteWord = () => {
    useStore.setState((state) => ({
      practice: state.practice.filter((w) => w.id !== word.id)
    }))
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const onChangeWord = () => {
    setIsEditMode(false)
    const newWord = inputRef?.current?.value

    if (!newWord) {
      toast.error('Word cannot be empty')
      return
    }

    if (
      useStore
        .getState()
        .practice.find((w) => w.text === newWord && w.id !== word.id)
    ) {
      toast.error('Word already exists')
      return
    }

    useStore.setState((state) => ({
      practice: state.practice.map((w) =>
        w.id === word.id ? { ...w, text: newWord } : w
      )
    }))
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    onChangeWord()
  }

  return (
    <div className="flex justify-between">
      <div className="w-full cursor-pointer group" onClick={toggleEditMode}>
        {isEditMode ? (
          <Input
            className="w-full"
            ref={inputRef}
            onBlur={onChangeWord}
            defaultValue={word.text}
            onKeyDown={onKeyDown}
          />
        ) : (
          <Text className="group-hover:text-green-500">{word.text}</Text>
        )}
      </div>
      <Button onClick={onDeleteWord} size="icon" color="red">
        <RiCloseFill className="w-full h-full" />
      </Button>
    </div>
  )
}

export const Words = () => {
  const words = useStore((state) => state.practice)

  return (
    <div>
      {words.map((word) => (
        <Word key={word.id} word={word} />
      ))}
    </div>
  )
}

export const PracticePage = () => {
  const categoryId = useParams<{ id: string }>().id

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newWord = event.currentTarget.value
      if (!newWord) {
        toast.error('Word cannot be empty')
        return
      }

      if (useStore.getState().practice.find((w) => w.text === newWord)) {
        toast.error('Word already exists')
        return
      }

      useStore.setState((state) => ({
        practice: [
          ...state.practice,
          { id: findLastId(state.practice) + 1, text: newWord }
        ]
      }))
      event.currentTarget.value = ''
    }
  }

  const words = useStore((state) => state.words)
  const practice = useStore((state) => state.practice)

  const categoryWords = words.filter((w) => w.categoryId === +categoryId)

  const wordsLeft = useMemo(
    () =>
      categoryWords.filter((w) => practice.find((p) => p.text === w.text))
        .length,
    [practice, words]
  )

  return (
    <div className="w-[320px] mx-auto">
      <Words />
      <Input
        onKeyDown={onKeyDown}
        type="text"
        placeholder="New category..."
        className="w-full mt-2"
      />
      <div className="mt-2">
        <ProgressBar wordsTotal={categoryWords.length} wordsLeft={wordsLeft} />
      </div>
    </div>
  )
}
