import { Button, SeparatorFull, Text } from 'ui'
import { Link } from 'react-router-dom'

export const Placeholder = () => (
  <div className="text-center">
    <div className="mx-auto md:w-1/3">
      <Text variant="h4">{'No words to practice'}</Text>
      <Text className="mt-4">
        {'You need at least 3 words with definitions to play this game.'}
      </Text>
      <SeparatorFull className="my-4" />
      <div className="flex flex-col mt-4">
        <Link to="/" className="flex flex-col w-full">
          <Button>{'Define Definitions'}</Button>
        </Link>
      </div>
    </div>
  </div>
)
