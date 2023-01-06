import {
  Input,
  InputCore,
  ListContainer,
  SeparatorFull,
  Text
} from 'components'
import { useStore, JokeType } from 'store'
import { toast } from 'react-toastify'
import { findLastId } from 'utils'
import { useParams } from 'react-router-dom'
import { Premises } from './premises'
import { WordManager } from './word-manager'
import produce from 'immer'

const EditJokeCore = ({ joke }: { joke: JokeType }) => {
  const onTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement & HTMLInputElement>
  ) => {
    useStore.setState((state) => ({
      jokes: state.jokes.map((j) =>
        j.id === joke.id ? { ...j, text: event.currentTarget.value } : j
      )
    }))
  }

  const onDraftChange = (
    event: React.ChangeEvent<HTMLTextAreaElement & HTMLInputElement>
  ) => {
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

    useStore.setState((state) =>
      produce(state, (draft) => {
        const currentJoke = draft.jokes.find((j) => j.id === joke.id)

        if (!currentJoke?.premises) return

        currentJoke.premises.push({
          id: findLastId(currentJoke.premises || []) + 1,
          text: newPremise
        })
      })
    )
  }

  return (
    <div>
      <WordManager joke={joke} />
      <div className="flex mt-8 space-x-4">
        <div className="w-1/3">
          <ListContainer>
            <div className="px-2">
              <Text variant="button">{'Premises'}</Text>
            </div>
            <SeparatorFull />
            <div className="px-2">
              <Premises joke={joke} />
            </div>
            <SeparatorFull className="mb-2" />
            <Input
              onKeyDown={onKeyDown}
              placeholder="New premise..."
              className="w-full"
            />
          </ListContainer>
        </div>
        <div className="w-1/3">
          <Text variant="button">{'Drafts'}</Text>
          <InputCore
            value={joke.draftText || ''}
            onChange={onDraftChange}
            className="h-[240px] w-full resize-none"
            $as="textarea"
          />
        </div>
        <div className="w-1/3">
          <Text variant="button">{'Joke'}</Text>
          <InputCore
            value={joke.text || ''}
            onChange={onTextChange}
            className="h-[240px] w-full resize-none"
            $as="textarea"
          />
        </div>
      </div>
    </div>
  )
}

export const EditJokePage = () => {
  const jokeId = useParams<{ id: string }>().id || -1

  const joke = useStore((state) => state.jokes.find((j) => j.id === +jokeId))

  if (!joke) return null

  return <EditJokeCore joke={joke} />
}
