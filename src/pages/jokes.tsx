import { Button, SeparatorSm, Text } from 'components'
import { useStore, JokeType } from 'store'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { Link } from 'react-router-dom'

export const Joke = ({ joke }: { joke: JokeType }) => {
  const onDelete = () => {
    useStore.setState((state) => ({
      jokes: state.jokes.filter((j) => j.id !== joke.id)
    }))
  }

  return (
    <div className="flex justify-between space-x-1">
      <div className="w-full cursor-pointer group">
        <Text className="group-hover:text-green-500">{joke.text}</Text>
      </div>
      <Link to={`/joke/${joke.id}`}>
        <Button size="icon">
          <FiEdit2 className="w-full h-full" />
        </Button>
      </Link>
      <div>
        <Button onClick={onDelete} size="icon" color="red">
          <RiCloseFill className="w-full h-full" />
        </Button>
      </div>
    </div>
  )
}

export const Jokes = () => {
  const jokes = useStore((state) => state.jokes)
  return (
    <div>
      {jokes.map((joke) => (
        <Joke key={joke.id} joke={joke} />
      ))}
    </div>
  )
}

export const JokesPage = () => {
  return (
    <div className="mx-auto w-[320px]">
      <Text variant="button">{'Jokes'}</Text>
      <SeparatorSm className="w-full my-4" />
      <Jokes />
      <div className="mt-4">
        <Link to="/joke/new">
          <Button>{'New Joke'}</Button>
        </Link>
      </div>
    </div>
  )
}
