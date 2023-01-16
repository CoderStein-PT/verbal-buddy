import { Button, SeparatorFull, Text } from 'ui'
import { Link } from 'react-router-dom'

export const Placeholder = () => (
  <div className="text-center">
    <div className="w-1/3 mx-auto">
      <Text variant="h4">{'Not enough content'}</Text>
      <Text className="mt-4">
        {'You need at least 1 word to create jokes.'}
      </Text>
      <SeparatorFull className="my-4" />
      <div className="flex flex-col mt-4">
        <Link to="/" className="flex flex-col w-full">
          <Button>{'Add Content'}</Button>
        </Link>
      </div>
    </div>
  </div>
)
