import { Button, SeparatorFull, Text } from 'components'
import { Link } from 'react-router-dom'

export const Placeholder = () => (
  <div className="text-center">
    <div>
      <Text variant="h4">{'No words to practice'}</Text>
      <Text>
        {'You need at least 3 words with descriptions to play this game.'}
      </Text>
      <SeparatorFull className="my-4" />
      <div className="mt-4">
        <Link to="/">
          <Button>{'Define Descriptions'}</Button>
        </Link>
      </div>
    </div>
  </div>
)
