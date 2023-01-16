import {
  Row,
  ScrollableContainer,
  useScrollableContainer,
  ControllableListInput,
  useControllableList,
  RecursiveWordType,
  UseWordEditorType
} from 'components'
import { useStore, WordType } from 'store'
import { toast } from 'react-toastify'
import produce from 'immer'
import { findLastId } from 'utils'
import { InputSendIcon } from 'ui'
import { useEffect, useState } from 'react'
import { Props } from './props1'
import isHotkey from 'is-hotkey'

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
  keys = 'definitions',
  onWordClick,
  recursiveWord,
  onKeyDown,
  wordEditor
}: {
  word: WordType
  height?: number
  maxHeight?: number
  keys?: PropKeyType
  onWordClick?: (id: number) => void
  recursiveWord: RecursiveWordType
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  wordEditor: UseWordEditorType
}) => {
  const scrollableContainer = useScrollableContainer({})
  const { text, setText } = wordEditor

  const [foundWords, setFoundWords] = useState<WordType[]>([])

  const nameByKey = namesByKeys[keys]
  const words = useStore((state) => state.words)

  const addProp = () => {
    if (!text) {
      toast.error(`${nameByKey[1]} cannot be empty`)
      return
    }

    if (word?.[keys]?.find((p) => p.text === text)) {
      toast.error(`${nameByKey[1]} already exists`)
      return
    }

    useStore.setState((s) =>
      produce(s, (state) => {
        const wordIndex = state.words.findIndex((w) => w.id === +word.id)
        const currentWord = state.words[wordIndex]
        const props = currentWord[keys]
        const id = findLastId(currentWord[keys] || []) + 1
        const newDescription = { id, text }

        currentWord[keys] = [...(props || []), newDescription]
      })
    )

    setText('')
    scrollableContainer.scrollDown()
  }

  const onRealKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown?.(e)) return

    if (!text && isHotkey('shift+left', e)) {
      e.preventDefault()
      recursiveWord.makePrevActive()
      return
    }

    if (!text && isHotkey('shift+right', e)) {
      e.preventDefault()
      recursiveWord.makeNextActive()
      return
    }

    if (e.key !== 'Enter') return

    if (e.shiftKey) {
      const id = findLastId(words) + 1
      useStore.setState((s) =>
        produce(s, (state) => {
          const newWord = { id, text }

          state.words = [...state.words, newWord]
        })
      )

      addWord(id)
      return
    }

    addProp()
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.currentTarget.value)
  }

  useEffect(() => {
    if (!text) return setFoundWords([])

    const foundWords = words.filter((w) =>
      w.text.toLowerCase().includes(text.toLowerCase())
    )
    setFoundWords(foundWords)
  }, [text, words])

  const addWord = (id: number) => {
    useStore.setState((s) =>
      produce(s, (state) => {
        const wordIndex = state.words.findIndex((w) => w.id === +word.id)

        const currentWord = state.words[wordIndex]
        const props = currentWord[keys]
        const newProp = {
          id: findLastId(currentWord[keys] || []) + 1,
          wordId: id
        }

        currentWord[keys] = [...(props || []), newProp]
      })
    )

    setText('')
    scrollableContainer.scrollDown()
  }

  const controllableList = useControllableList({
    scrollableContainer,
    length: foundWords.length || word[keys]?.length || 0,
    onEnter: (index) => {
      if (foundWords.length) {
        addWord(foundWords[index].id)
        return
      }

      const wordId = word[keys]?.[index]?.wordId
      if (!wordId) return

      onWordClick?.(wordId)
    },
    onDelete: (index) => {
      useStore.setState((s) =>
        produce(s, (state) => {
          const wordIndex = state.words.findIndex((w) => w.id === +word.id)
          const currentWord = state.words[wordIndex]
          const props = currentWord[keys]
          const newProps = props?.filter((_, i) => i !== index)

          currentWord[keys] = newProps
        })
      )
    }
  })

  return (
    <div>
      <ScrollableContainer
        height={height}
        maxHeight={maxHeight}
        scrollableContainer={scrollableContainer}
      >
        <div className="px-2" data-test={'word-editor-' + keys}>
          {!!foundWords.length ? (
            <div>
              {foundWords.map((w, idx) => (
                <div key={w.id}>
                  <Row
                    isSelected={controllableList.selectedIdx === idx}
                    selectedColor="primary"
                    onClick={() => addWord(w.id)}
                    text={w.text}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Props
              onClick={onWordClick}
              word={word}
              keys={keys}
              nameByKey={nameByKey}
              controllableList={controllableList}
            />
          )}
        </div>
      </ScrollableContainer>
      <div className="relative mt-2">
        <ControllableListInput
          onKeyDown={onRealKeyDown}
          type="text"
          placeholder={`Add ${nameByKey[0]}`}
          className={'w-full'}
          value={text}
          onChange={onChange}
          autoFocus
          big
          icon={<InputSendIcon onClick={addProp} title={'Add (Enter key)'} />}
          controllableList={controllableList}
          selectedItemText={
            controllableList.selectedIdx !== null
              ? foundWords[controllableList.selectedIdx]?.text ||
                word[keys]?.[controllableList.selectedIdx]?.text ||
                words.find((w) =>
                  controllableList.selectedIdx
                    ? w.id ===
                      word[keys]?.[controllableList.selectedIdx]?.wordId
                    : false
                )?.text
              : undefined
          }
        />
      </div>
    </div>
  )
}
