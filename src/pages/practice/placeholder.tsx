import { Button, Text } from 'ui'
import { Link } from 'react-router-dom'

export const Placeholder = ({ categoryId }: { categoryId: number }) => (
  <div className="text-center">
    <div>
      <Text variant="h4">{'No words to practice'}</Text>
      <Text>{'To practice, add some words to the category'}</Text>
      <div className="flex justify-center mt-2">
        <Link to={`/category/${categoryId}`}>
          <Button className="ml-2">{'Add words'}</Button>
        </Link>
      </div>
    </div>
  </div>
)
