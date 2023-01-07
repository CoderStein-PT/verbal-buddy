import { Text } from 'components'
import { CategoryType, useStore, WordType } from 'store'
import { Word } from './word'

export const Words = ({
  categoryWords,
  category,
  checkIfGuessedAll
}: {
  categoryWords: WordType[]
  category: CategoryType
  checkIfGuessedAll: () => void
}) => {
  const words = useStore((state) => state.practice)

  const onWordAdded = () => {
    checkIfGuessedAll()
  }

  return (
    <div>
      {!!words.length ? (
        words.map((word, index) => (
          <Word
            categoryWords={categoryWords}
            key={word.id}
            word={word}
            index={index + 1}
            category={category}
            onWordAdded={onWordAdded}
          />
        ))
      ) : (
        <Text color="gray-light" className="text-center">
          {'Start typing words you know 🔥'}
        </Text>
      )}
    </div>
  )
}
