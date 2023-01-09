import { Button, Row, SeparatorFull, ScrollableContainer } from 'components'
import { useStore, JokeType } from 'store'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { useNavigate } from 'react-router-dom'
import { Placeholder } from './placeholder'

export const Joke = ({ joke, index }: { joke: JokeType; index: number }) => {
  const words = useStore((state) => state.words)
  const jokeWords = joke?.wordIds?.map((id) => words.find((w) => w.id === id))
  const text = jokeWords?.flatMap((w) => w?.text).join(', ')

  const onDelete = () => {
    const confirmation = window.confirm(
      `Are you sure you want to delete category "${text}"?`
    )
    if (!confirmation) return

    useStore.setState((state) => ({
      jokes: state.jokes.filter((j) => j.id !== joke.id)
    }))
  }

  const navigate = useNavigate()

  return (
    <Row
      text={text}
      onClick={() => navigate(`/joke/${joke.id}`)}
      index={index}
      actions={[
        { title: 'Delete', icon: RiCloseFill, onClick: onDelete, color: 'red' }
      ]}
    />
  )
}

export const Jokes = () => {
  const jokes = useStore((state) => state.jokes)
  return (
    <ScrollableContainer>
      <div className="px-2">
        {jokes.map((joke, index) => (
          <Joke key={joke.id} joke={joke} index={index + 1} />
        ))}
      </div>
    </ScrollableContainer>
  )
}

export const JokesPage = () => {
  const navigate = useNavigate()
  const words = useStore((state) => state.words)

  if (words.length < 3) return <Placeholder />

  return (
    <div className="mx-auto w-[600px]">
      <SeparatorFull className="my-4" />
      <Jokes />
      <SeparatorFull className="my-4" />
      <div className="flex justify-end mt-4">
        <Button onClick={() => navigate('/jokes/new')}>{'New Joke'}</Button>
      </div>
    </div>
  )
}
