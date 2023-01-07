import {
  Input,
  Row,
  ScrollableContainer,
  useScrollableContainer,
  Text
} from 'components'
import { DescriptionType, useStore, WordType } from 'store'
import { toast } from 'react-toastify'
import produce from 'immer'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { findLastId } from 'utils'

const Description = ({
  word,
  description,
  index
}: {
  word: WordType
  description: DescriptionType
  index: number
}) => {
  const onDeleteDescription = () => {
    useStore.setState((s) =>
      produce(s, (state) => {
        const wordIndex = state.words.findIndex((w) => w.id === word.id)
        const descriptions = state.words[wordIndex].descriptions
        if (!descriptions) return

        state.words[wordIndex].descriptions = descriptions.filter(
          (d) => d.id !== description.id
        )
      })
    )
  }

  const onChangeDescription = (text: string | undefined) => {
    if (!text) {
      toast.error('Description cannot be empty')
      return
    }

    if (
      word?.descriptions?.find(
        (d) => d.text === text && d.id !== description.id
      )
    ) {
      toast.error('Description already exists')
      return
    }

    useStore.setState((s) =>
      produce(s, (state) => {
        const wordIndex = state.words.findIndex((w) => w.id === word.id)
        const descriptions = state.words[wordIndex].descriptions
        if (!descriptions) return

        const descriptionIndex = descriptions.findIndex(
          (d) => d.id === description.id
        )
        descriptions[descriptionIndex].text = text
      })
    )
  }

  return (
    <Row
      text={description.text}
      onChange={onChangeDescription}
      index={index}
      actions={[
        {
          title: 'Delete',
          icon: RiCloseFill,
          onClick: onDeleteDescription,
          color: 'red'
        }
      ]}
    />
  )
}

export const Descriptions = ({
  word,
  height,
  maxHeight
}: {
  word: WordType
  height?: number
  maxHeight?: number
}) => {
  const scrollableContainer = useScrollableContainer({})

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return

    const text = event.currentTarget.value

    if (!text) {
      toast.error('Description cannot be empty')
      return
    }

    const words = useStore.getState().words

    if (words.find((w) => w.text === text && w.id === +word.id)) {
      toast.error('Description already exists')
      return
    }

    useStore.setState((s) =>
      produce(s, (state) => {
        const wordIndex = state.words.findIndex((w) => w.id === +word.id)
        const currentWord = state.words[wordIndex]
        const descriptions = currentWord.descriptions
        const id = findLastId(currentWord.descriptions || []) + 1
        const newDescription = { id, text }

        currentWord.descriptions = [...(descriptions || []), newDescription]
      })
    )

    event.currentTarget.value = ''
    scrollableContainer.scrollDown()
  }

  return (
    <div>
      <div className="px-2">
        <ScrollableContainer
          height={height}
          maxHeight={maxHeight}
          scrollableContainer={scrollableContainer}
        >
          <div>
            {word.descriptions?.length ? (
              word.descriptions.map((d, index) => (
                <Description
                  key={d.id}
                  word={word}
                  description={d}
                  index={index + 1}
                />
              ))
            ) : (
              <Text
                className="text-center"
                variant="subtitle"
                color="gray-light"
              >
                {'No descriptions yet 🧐'}
              </Text>
            )}
          </div>
        </ScrollableContainer>
      </div>
      <Input
        onKeyDown={onKeyDown}
        type="text"
        placeholder="New description..."
        className="w-full mt-2"
      />
    </div>
  )
}
