import { Button, Input, Text } from 'components'
import { useStore, WordType } from 'store'
import { findLastId } from 'utils'
import { toast } from 'react-toastify'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { useRef, useState } from 'react'

export const Word = ({ word }: { word: WordType }) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onDeleteWord = () => {
    useStore.setState((state) => ({
      words: state.words.filter((w) => w.id !== word.id)
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
        .words.find((w) => w.text === newWord && w.id !== word.id)
    ) {
      toast.error('Word already exists')
      return
    }

    useStore.setState((state) => ({
      words: state.words.map((w) =>
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
        {<RiCloseFill className="w-full h-full" />}
      </Button>
    </div>
  )
}

export const Words = () => {
  const words = useStore((state) => state.words)
  return (
    <div>
      {words.map((word) => (
        <Word key={word.id} word={word} />
      ))}
    </div>
  )
}

export const WordsPage = () => {
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newWord = event.currentTarget.value
      if (!newWord) {
        toast.error('Word cannot be empty')
        return
      }

      if (useStore.getState().words.find((w) => w.text === newWord)) {
        toast.error('Word already exists')
        return
      }

      useStore.setState((state) => ({
        words: [
          ...state.words,
          { id: findLastId(state.words) + 1, text: newWord }
        ]
      }))
      event.currentTarget.value = ''
    }
  }

  return (
    <div className="w-[320px] mx-auto">
      <Words />
      <Input
        onKeyDown={onKeyDown}
        type="text"
        placeholder="New word..."
        className="w-full mt-2"
      />
    </div>
  )
}
