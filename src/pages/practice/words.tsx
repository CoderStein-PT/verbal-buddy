import { Text } from 'ui'
import { CategoryType, useStore, WordType } from 'store'
import { Word } from './word'
import { useI18n } from 'i18n'

export const Words = ({
  categoryWords,
  category,
  checkIfFinished
}: {
  categoryWords: WordType[]
  category: CategoryType
  checkIfFinished: () => void
}) => {
  const { t } = useI18n()
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
          {t('startTypingWords')}
        </Text>
      )}
    </div>
  )
}
