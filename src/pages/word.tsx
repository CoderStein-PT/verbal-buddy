import { Button, Input, SeparatorSm, Text } from 'components'
import { DescriptionType, useStore, WordType } from 'store'
import { toast } from 'react-toastify'
import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import produce from 'immer'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { findLastId } from 'utils'

export const Description = ({
  word,
  description,
  index
}: {
  word: WordType
  description: DescriptionType
  index: number
}) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onDeleteDescription = () => {
    useStore.setState(
      produce((state) => {
        const wordIndex = state.words.findIndex((w) => w.id === word.id)
        state.words[wordIndex].descriptions = state.words[
          wordIndex
        ].descriptions.filter((d) => d.id !== description.id)
      })
    )
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const onChangeDescription = () => {
    setIsEditMode(false)
    const text = inputRef?.current?.value

    if (!text) {
      toast.error('Description cannot be empty')
      return
    }

    if (
      word?.descriptions?.find(
        (d) => d.text === text && d.id !== description.id
      )
    ) {
      toast.error('Description already exists')
      return
    }

    useStore.setState(
      produce((state) => {
        const wordIndex = state.words.findIndex((w) => w.id === word.id)
        const descriptionIndex = state.words[wordIndex].descriptions.findIndex(
          (d) => d.id === description.id
        )
        state.words[wordIndex].descriptions[descriptionIndex].text = text
      })
    )
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    onChangeDescription()
  }

  return (
    <div className="flex items-center justify-between">
      <div className="w-full cursor-pointer group" onClick={toggleEditMode}>
        {isEditMode ? (
          <Input
            className="w-full"
            ref={inputRef}
            onBlur={onChangeDescription}
            defaultValue={description.text}
            onKeyDown={onKeyDown}
          />
        ) : (
          <Text className="group-hover:text-green-500">{description.text}</Text>
        )}
      </div>
      <div className="flex space-x-1">
        <div>
          <Button
            onClick={onDeleteDescription}
            title="Delete description"
            size="icon"
            color="red"
          >
            <RiCloseFill className="w-full h-full" />
          </Button>
        </div>
      </div>
      <div className="w-8 ml-2 text-right">
        <Text
          className="group-hover:text-green-500"
          variant="subtitle"
          color="gray-light"
        >
          {index}
        </Text>
      </div>
    </div>
  )
}

const Descriptions = ({ word }: { word: WordType }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollContainerDown = () => {
    setTimeout(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }, 0)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return

    const text = event.currentTarget.value

    if (!text) {
      toast.error('Description cannot be empty')
      return
    }

    if (
      useStore
        .getState()
        .words.find((w) => w.text === text && w.id === +word.id)
    ) {
      toast.error('Description already exists')
      return
    }

    useStore.setState((s) =>
      produce(s, (state) => {
        const wordIndex = state.words.findIndex((w) => w.id === +word.id)
        const descriptions = state.words[wordIndex].descriptions
        const newDescription = {
          id: findLastId(descriptions || []) + 1,
          text
        }

        state.words[wordIndex].descriptions = descriptions
          ? [...descriptions, newDescription]
          : [newDescription]
      })
    )

    event.currentTarget.value = ''
    scrollContainerDown()
  }

  return (
    <div className="max-h-[500px] overflow-y-auto" ref={containerRef}>
      <div>
        {word?.descriptions?.map((d, index) => (
          <Description key={d.id} word={word} description={d} index={index} />
        ))}
      </div>
      <Input
        onKeyDown={onKeyDown}
        type="text"
        placeholder="New description..."
        className="w-full mt-2"
      />
    </div>
  )
}

export const WordPageCore = ({ word }: { word: WordType }) => {
  return (
    <div className="w-[400px] mx-auto">
      <Text variant="subtitle">{'Word'}</Text>
      <Text variant="button">{word.text}</Text>
      <SeparatorSm className="w-full my-4" />
      <div>
        <Descriptions word={word} />
      </div>
    </div>
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
