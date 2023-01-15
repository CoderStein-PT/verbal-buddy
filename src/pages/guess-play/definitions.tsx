import { Row, ScrollableContainer } from 'components'
import { WordPropType, WordType } from 'store'
import { useMemo } from 'react'
import { shuffleArray } from 'utils'

const Definition = ({
  definition,
  index
}: {
  definition: WordPropType
  index: number
}) => {
  return <Row text={definition.text} index={index} />
}

export const Definitions = ({
  word,
  descriptionCount
}: {
  word: WordType
  descriptionCount: number
}) => {
  const processedDefinitions = useMemo(() => {
    if (!word.definitions || word.definitions.length === 0) return null

    return shuffleArray(word.definitions)
  }, [word.definitions])

  if (!processedDefinitions) return null

  return (
    <div className="p-2 mt-2 border border-gray-600 rounded-md">
      <ScrollableContainer>
        <div className="divide-y divide-gray-600 divide-dashed">
          {processedDefinitions.slice(0, descriptionCount).map((d, index) => (
            <Definition key={d.id} definition={d} index={index + 1} />
          ))}
        </div>
      </ScrollableContainer>
    </div>
  )
}
