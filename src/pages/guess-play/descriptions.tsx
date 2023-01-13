import { Row, ScrollableContainer } from 'components'
import { DescriptionType, WordType } from 'store'
import { useMemo } from 'react'

const Description = ({
  description,
  index
}: {
  description: DescriptionType
  index: number
}) => {
  return <Row text={description.text} index={index} />
}

const shuffleArray = (array: any[]) => {
  return [...array].sort(() => 0.5 - Math.random())
}

export const Descriptions = ({
  word,
  descriptionCount
}: {
  word: WordType
  descriptionCount: number
}) => {
  const processedDescriptions = useMemo(() => {
    if (!word.descriptions || word.descriptions.length === 0) return null

    return shuffleArray(word.descriptions)
  }, [word.descriptions])

  if (!processedDescriptions) return null

  return (
    <div className="p-2 mt-2 border border-gray-600 rounded-md">
      <ScrollableContainer>
        <div className="divide-y divide-gray-600 divide-dashed">
          {processedDescriptions.slice(0, descriptionCount).map((d, index) => (
            <Description key={d.id} description={d} index={index + 1} />
          ))}
        </div>
      </ScrollableContainer>
    </div>
  )
}
