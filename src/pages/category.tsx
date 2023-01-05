import { Button, Input, SeparatorSm, Text } from 'components'
import { useStore, WordType } from 'store'
import { findLastId } from 'utils'
import { toast } from 'react-toastify'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { Link } from 'react-router-dom'

export const Word = ({ word, index }: { word: WordType; index: number }) => {
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
    <div className="flex items-center justify-between">
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
      <div className="flex space-x-1">
        <div>
          <Link to={`/word/${word.id}`}>
            <Button title="Add descriptions" size="icon">
              <FiEdit2 className="w-full h-full" />
            </Button>
          </Link>
        </div>
        <div>
          <Button
            onClick={onDeleteWord}
            title="Delete word"
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

export const Words = ({ categoryId }: { categoryId: number }) => {
  const words = useStore((state) => state.words)

  return (
    <div>
      {words
        .filter((w) => w.categoryId === categoryId)
        .map((word, index) => (
          <Word key={word.id} index={index + 1} word={word} />
        ))}
    </div>
  )
}

export const CategoryPage = () => {
  const categoryId = useParams<{ id: string }>().id

  const category = useStore((state) => state.categories).find(
    (c) => c.id === +categoryId
  )

  const containerRef = useRef<HTMLDivElement>(null)

  const scrollContainerDown = () => {
    setTimeout(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }, 0)
  }

  useEffect(() => {
    scrollContainerDown()
  }, [])

  if (!categoryId) return null

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newWord = event.currentTarget.value
      if (!newWord) {
        toast.error('Word cannot be empty')
        return
      }

      if (
        useStore
          .getState()
          .words.find((w) => w.text === newWord && w.categoryId === +categoryId)
      ) {
        toast.error('Word in this category already exists')
        return
      }

      useStore.setState((state) => ({
        words: [
          ...state.words,
          {
            id: findLastId(state.words) + 1,
            text: newWord,
            categoryId: +categoryId
          }
        ]
      }))
      event.currentTarget.value = ''
      scrollContainerDown()
    }
  }

  return (
    <div className="w-[400px] mx-auto">
      <Text variant="subtitle">{'Category'}</Text>
      <Text variant="button">{category?.name}</Text>
      <SeparatorSm className="w-full my-4" />
      <div className="max-h-[500px] overflow-y-auto" ref={containerRef}>
        <Words categoryId={+categoryId} />
      </div>
      <Input
        onKeyDown={onKeyDown}
        type="text"
        placeholder="New word..."
        className="w-full mt-2"
      />
    </div>
  )
}
