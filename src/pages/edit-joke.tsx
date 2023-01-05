import { Button, Input, InputCore, Text } from 'components'
import { useRef, useState } from 'react'
import {
  useStore,
  DescriptionType,
  WordType,
  PremiseType,
  JokeType
} from 'store'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { toast } from 'react-toastify'
import { findLastId } from 'utils'
import { useParams } from 'react-router-dom'
import { WordEditor } from './word/word-editor'
import { ScrollableContainer } from './word/scrollable-container'

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
            defaultValue={description.text}
            onKeyDown={onKeyDown}
          />
        ) : (
          <Text className="group-hover:text-green-500">{description.text}</Text>
        )}
      </div>
      <div>
        <Button onClick={onDeleteWordDescription} size="icon" color="red">
          <RiCloseFill className="w-full h-full" />
        </Button>
      </div>
    </div>
  )
}

const Word = ({ word }: { word: WordType }) => {
  const addDescriptionToSelectedWord = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== 'Enter') return

    const newDescription = event.currentTarget.value

    if (!newDescription) {
      toast.error('Description cannot be empty')
      return
    }

    if (word.descriptions?.find((d) => d.text === newDescription)) {
      toast.error('Description already exists')
      return
    }

    event.currentTarget.value = ''

    useStore.setState((state) => ({
      words: state.words.map((w) =>
        w.id === word.id
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

  if (!word) return null

  return (
    <div className="w-[320px] mx-auto">
      <Text variant="h5">{word.text}</Text>
      {word.descriptions?.map((description) => (
        <Description
          word={word}
          key={description.id}
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

const Premise = ({
  premise,
  joke
}: {
  premise: PremiseType
  joke: JokeType
}) => {
  const deletePremise = () => {
    useStore.setState((state) => ({
      jokes: state.jokes.map((j) =>
        j.id === joke.id
          ? {
              ...j,
              premises: j.premises?.filter((p) => p.id !== premise.id)
            }
          : j
      )
    }))
  }

  return (
    <div className="flex justify-between">
      <Text variant="subtitle">{premise.text}</Text>
      <div>
        <Button size="icon" color="red" onClick={deletePremise}>
          <RiCloseFill className="w-full h-full" />
        </Button>
      </div>
    </div>
  )
}

const Premises = ({ joke }: { joke: JokeType }) => {
  if (!joke.premises) return null

  return (
    <ScrollableContainer maxHeight={200}>
      {joke.premises.map((premise) => (
        <Premise joke={joke} key={premise.id} premise={premise} />
      ))}
    </ScrollableContainer>
  )
}

const EditJokeCore = ({ joke }: { joke: JokeType }) => {
  const words = useStore((state) => state.words)

  const onTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    useStore.setState((state) => ({
      jokes: state.jokes.map((j) =>
        j.id === joke.id ? { ...j, text: event.currentTarget.value } : j
      )
    }))
  }

  const onDraftChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    useStore.setState((state) => ({
      jokes: state.jokes.map((j) =>
        j.id === joke.id ? { ...j, draftText: event.currentTarget.value } : j
      )
    }))
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return

    const newPremise = event.currentTarget.value

    if (!newPremise) {
      toast.error('Premise cannot be empty')
      return
    }

    if (joke.text?.includes(newPremise)) {
      toast.error('Premise already exists')
      return
    }

    event.currentTarget.value = ''

    useStore.setState((state) => ({
      jokes: state.jokes.map((j) =>
        j.id === joke.id
          ? {
              ...j,
              premises: [
                ...(j.premises || []),
                {
                  id: findLastId(j.premises || []) + 1,
                  text: newPremise
                }
              ]
            }
          : j
      )
    }))
  }

  return (
    <div>
      <div className="flex">
        {joke?.wordIds?.map((id) => (
          <WordEditor key={id} word={words.find((w) => w.id === id)} />
        ))}
      </div>
      <div className="flex mt-8 space-x-4">
        <div className="w-full">
          <Text variant="button">{'Drafts'}</Text>
          <InputCore
            value={joke.draftText || ''}
            onChange={onDraftChange}
            className="h-[100px] w-full resize-none"
            $as="textarea"
          />
        </div>
        <div className="w-full">
          <Text variant="button">{'Premises'}</Text>
          <Premises joke={joke} />
          <Input
            onKeyDown={onKeyDown}
            placeholder="New premise..."
            className="w-full"
          />
        </div>
      </div>
      <div className="w-full">
        <Text variant="button">{'Joke'}</Text>
        <InputCore
          value={joke.text || ''}
          onChange={onTextChange}
          className="h-[240px] w-full resize-none"
          $as="textarea"
        />
      </div>
    </div>
  )
}

export const EditJokePage = () => {
  const jokeId = useParams<{ id: string }>().id

  const joke = useStore((state) => state.jokes.find((j) => j.id === +jokeId))

  if (!joke) return null

  return <EditJokeCore joke={joke} />
}
