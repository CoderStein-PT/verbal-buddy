import { Button, Input, Text } from 'components'
import { useRef, useState } from 'react'
import { useStore, DescriptionType, WordType } from 'store'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { toast } from 'react-toastify'
import { findLastId } from 'utils'

export const Description = ({
  word,
  description
}: {
  word: WordType
  description: DescriptionType
}) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const onDeleteWordDescription = () => {
    useStore.setState((state) => ({
      words: state.words.map((w) =>
        w.id === word.id
          ? {
              ...w,
              descriptions: w.descriptions?.filter(
                (d) => d.id !== description.id
              )
            }
          : w
      )
    }))
  }

  const onChangeWordDescription = () => {
    setIsEditMode(false)
    const newDescription = inputRef?.current?.value

    if (!newDescription) {
      toast.error('Description cannot be empty')
      return
    }

    if (
      useStore
        .getState()
        .words.find((w) =>
          w.descriptions?.find(
            (d) => d.text === newDescription && d.id !== description.id
          )
        )
    ) {
      toast.error('Description already exists')
      return
    }

    useStore.setState((state) => ({
      words: state.words.map((w) =>
        w.id === word.id
          ? {
              ...w,
              descriptions: w.descriptions?.map((d) =>
                d.id === description.id ? { ...d, text: newDescription } : d
              )
            }
          : w
      )
    }))
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    onChangeWordDescription()
  }

  return (
    <div className="flex justify-between">
      <div className="w-full cursor-pointer group" onClick={toggleEditMode}>
        {isEditMode ? (
          <Input
            className="w-full"
            ref={inputRef}
            onBlur={onChangeWordDescription}
            defaultValue={description}
            onKeyDown={onKeyDown}
          />
        ) : (
          <Text className="group-hover:text-green-500">{description.text}</Text>
        )}
      </div>
      <Button onClick={onDeleteWordDescription} size="icon" color="red">
        <RiCloseFill className="w-full h-full" />
      </Button>
    </div>
  )
}

const SelectedWord = ({ selectedWord }: { selectedWord: WordType }) => {
  const addDescriptionToSelectedWord = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== 'Enter') return

    const newDescription = event.currentTarget.value

    if (!newDescription) {
      toast.error('Description cannot be empty')
      return
    }

    if (selectedWord.descriptions?.find((d) => d.text === newDescription)) {
      toast.error('Description already exists')
      return
    }

    event.currentTarget.value = ''

    useStore.setState((state) => ({
      words: state.words.map((w) =>
        w.id === selectedWord.id
          ? {
              ...w,
              descriptions: [
                ...(w.descriptions || []),
                {
                  id: findLastId(w.descriptions || []) + 1,
                  text: newDescription
                }
              ]
            }
          : w
      )
    }))
  }

  const word = useStore((s) => s.words.find((w) => w.id === selectedWord.id))

  if (!word) return null

  return (
    <div className="w-[320px] mx-auto">
      <Text variant="h5">{selectedWord.text}</Text>
      {word.descriptions?.map((description) => (
        <Description
          word={selectedWord}
          key={description}
          description={description}
        />
      ))}
      <Input
        onKeyDown={addDescriptionToSelectedWord}
        type="text"
        placeholder="New word..."
        className="w-full mt-2"
      />
    </div>
  )
}

export const JokeWritePage = () => {
  const selectedWords = useStore((state) => state.selectedWords)

  return (
    <div className="flex">
      {selectedWords.map((selectedWord) => (
        <SelectedWord key={selectedWord.id} selectedWord={selectedWord} />
      ))}
    </div>
  )
}
