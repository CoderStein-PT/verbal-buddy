import { InputCore, Text } from 'components'
import { useStore, JokeType } from 'store'
import { useParams } from 'react-router-dom'
import { WordManager } from './word-manager'
import { PremisesBase } from './premises'

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

  return (
    <div>
      <WordManager joke={joke} />
      <div className="flex flex-col mt-4 space-x-0 space-y-2 md:space-y-0 md:space-x-4 md:flex-row">
        <div className="w-full md:w-1/3">
          <PremisesBase joke={joke} />
        </div>
        <div className="w-full md:w-1/3">
          <Text variant="button">{'Drafts'}</Text>
          <div className="overflow-hidden rounded-md">
            <InputCore
              value={joke.draftText || ''}
              onChange={onDraftChange}
              className="h-[240px] w-full resize-none"
              $as="textarea"
            />
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <Text variant="button">{'Joke'}</Text>
          <div className="overflow-hidden rounded-md">
            <InputCore
              value={joke.text || ''}
              onChange={onTextChange}
              className="h-[240px] w-full resize-none"
              $as="textarea"
            />
          </div>
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
