import { Input, ScrollableContainer, useScrollableContainer } from 'components'
import { useStore, WordType } from 'store'
import { toast } from 'react-toastify'
import produce from 'immer'
import { findLastId } from 'utils'
import { InputSendIcon } from 'components/input/input-send-icon'
import { useState } from 'react'
import { Props } from './Props'

export type PropKeyType = keyof Pick<
  WordType,
  'props' | 'opposites' | 'definitions'
>

export const namesByKeys: Record<PropKeyType, string[]> = {
  definitions: ['Definitions', 'Definition'],
  props: ['Properties', 'Property'],
  opposites: ['Opposites', 'Opposite']
}

export const Properties = ({
  word,
  height,
  maxHeight,
  keys = 'definitions'
}: {
  word: WordType
  height?: number
  maxHeight?: number
  keys?: PropKeyType
}) => {
  const scrollableContainer = useScrollableContainer({})
  const [text, setText] = useState('')

  const nameByKey = namesByKeys[keys]

  const addProp = () => {
    if (!text) {
      toast.error(`${nameByKey[1]} cannot be empty`)
      return
    }

    const words = useStore.getState().words

    if (words.find((w) => w.text === text && w.id === +word.id)) {
      toast.error(`${nameByKey[1]} already exists`)
      return
    }

    useStore.setState((s) =>
      produce(s, (state) => {
        const wordIndex = state.words.findIndex((w) => w.id === +word.id)
        const currentWord = state.words[wordIndex]
        const descriptions = currentWord[keys]
        const id = findLastId(currentWord[keys] || []) + 1
        const newDescription = { id, text }

        currentWord[keys] = [...(descriptions || []), newDescription]
      })
    )

    setText('')
    scrollableContainer.scrollDown()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return

    addProp()
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.currentTarget.value)
  }

  return (
    <div>
      <ScrollableContainer
        height={height}
        maxHeight={maxHeight}
        scrollableContainer={scrollableContainer}
      >
        <div className="px-2" data-test={'word-editor-' + keys}>
          <Props word={word} keys={keys} nameByKey={nameByKey} />
        </div>
      </ScrollableContainer>
      <div className="relative mt-2">
        <Input
          onKeyDown={onKeyDown}
          type="text"
          placeholder={`Add ${nameByKey[0]}`}
          className="w-full"
          autoFocus
          onChange={onChange}
          value={text}
          big
          icon={<InputSendIcon onClick={addProp} title={'Add (Enter key)'} />}
        />
      </div>
    </div>
  )
}
