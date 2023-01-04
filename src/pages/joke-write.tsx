import { Button, Input, InputCore, Text } from 'components'
import { useRef, useState } from 'react'
import { useStore, DescriptionType, WordType, PremiseType } from 'store'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { toast } from 'react-toastify'
import { findLastId } from 'utils'
import { useNavigate } from 'react-router-dom'

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

const Premise = ({ premise }: { premise: PremiseType }) => {
  const deletePremise = () => {
    useStore.setState((state) => ({
      jokeDraft: {
        ...state.jokeDraft,
        premises: state.jokeDraft.premises?.filter((p) => p.id !== premise.id)
      }
    }))
  }

  return (
    <div className="flex justify-between">
      <Text>{premise.text}</Text>
      <Button size="icon" color="red" onClick={deletePremise}>
        <RiCloseFill className="w-full h-full" />
      </Button>
    </div>
  )
}

const Premises = () => {
  const jokeDraft = useStore((state) => state.jokeDraft)

  if (!jokeDraft.premises) return null

  return (
    <div className="">
      {jokeDraft.premises.map((premise) => (
        <Premise key={premise.id} premise={premise} />
      ))}
    </div>
  )
}

export const JokeWritePage = () => {
  const selectedWords = useStore((state) => state.selectedWords)
  const text = useStore((state) => state.jokeDraft.text)
  const draftText = useStore((state) => state.jokeDraft.draftText)
  const navigate = useNavigate()

  const saveJoke = () => {
    useStore.setState((state) => ({
      jokes: [
        ...state.jokes,
        {
          id: findLastId(state.jokes) + 1,
          words: state.selectedWords,
          draftText: state.jokeDraft.draftText,
          premises: state.jokeDraft.premises,
          text: state.jokeDraft.text
        }
      ],
      selectedWords: [],
      jokeDraft: { draftText: '', premises: [], text: '' }
    }))
    navigate('/jokes')
  }

  const onTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    useStore.setState((state) => ({
      jokeDraft: { ...state.jokeDraft, text: event.currentTarget.value }
    }))
  }

  const onDraftChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    useStore.setState((state) => ({
      jokeDraft: { ...state.jokeDraft, draftText: event.currentTarget.value }
    }))
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return

    const newPremise = event.currentTarget.value

    if (!newPremise) {
      toast.error('Premise cannot be empty')
      return
    }

    if (text?.includes(newPremise)) {
      toast.error('Premise already exists')
      return
    }

    event.currentTarget.value = ''

    useStore.setState((state) => ({
      jokeDraft: {
        ...state.jokeDraft,
        premises: [
          ...(state.jokeDraft.premises || []),
          {
            id: findLastId(state.jokeDraft.premises || []) + 1,
            text: newPremise
          }
        ]
      }
    }))
  }

  return (
    <div>
      <div className="flex">
        {selectedWords.map((selectedWord) => (
          <SelectedWord key={selectedWord.id} selectedWord={selectedWord} />
        ))}
      </div>
      <div className="flex mt-8 space-x-4">
        <div className="w-full">
          <Text variant="button">{'Drafts'}</Text>
          <InputCore
            value={draftText}
            onChange={onDraftChange}
            className="h-[240px] w-full resize-none"
            $as="textarea"
          />
        </div>
        <div className="w-full">
          <Text variant="button">{'Premises'}</Text>
          <Premises />
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
          value={text}
          onChange={onTextChange}
          className="h-[240px] w-full resize-none"
          $as="textarea"
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={saveJoke}>{'Create'}</Button>
      </div>
    </div>
  )
}
