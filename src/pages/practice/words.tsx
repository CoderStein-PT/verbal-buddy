import { Text } from 'ui'
import { CategoryType, useStore, WordType } from 'store'
import { Word } from './word'

export const Words = ({
  categoryWords,
  category,
  checkIfFinished
}: {
  categoryWords: WordType[]
  category: CategoryType
  checkIfFinished: () => void
}) => {
  const words = useStore((state) => state.practice)

  const onWordAdded = () => {
    checkIfFinished()
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
        <Text color="gray-light" className="text-center" variant="button">
          {'Start typing words you know 🔥'}
        </Text>
      )}
    </div>
  )
}
