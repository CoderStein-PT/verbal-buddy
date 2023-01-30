import {
  PageContainer,
  useScrollableContainer,
  useControllableList,
  ControllableListInput,
  ControllableListContext,
  ScrollableContainerType
} from 'components'
import { SeparatorFull, Text, InputIcons } from 'ui'
import isHotkey from 'is-hotkey'
import { CategoryType, useStore, WordType } from 'store'
import {
  capitalizeWords,
  compareStrings,
  findLastId,
  getTextInMode,
  pronounce
} from 'utils'
import { toast } from 'react-toastify'
import { Navigate, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Words } from './words'
import { Header } from './header'
import { useVoiceInput } from 'components/scrollable-container/use-voice-input'

const WrappedWords = ({
  scrollableContainer,
  filteredWords
}: {
  scrollableContainer: ScrollableContainerType
  filteredWords: WordType[]
}) => {
  return (
    <Words scrollableContainer={scrollableContainer} words={filteredWords} />
  )
}

export const CategoryPageCore = ({ category }: { category: CategoryType }) => {
  const scrollableContainer = useScrollableContainer({})
  const navigate = useNavigate()
  const [newWord, setNewWord] = useState<string>('')
  const words = useStore((state) => state.words)
  const inputRef = useRef<HTMLInputElement>(null)
  const settings = useStore((state) => state.settings)

  const filteredWords = useMemo(
    () => words.filter((w) => w.categoryId === category.id),
    [words, category]
  )

  const controllableList = useControllableList({
    length: filteredWords.length,
    onPronounce: (itemIdx) => {
      const word = filteredWords[itemIdx]
      pronounce(word?.text)
    },
    onEnter: (itemIdx) => {
      const word = filteredWords[itemIdx]
      if (!word) return
      navigate(`/word/${word.id}`)
    },
    onDelete: (itemIdx) => {
      const word = filteredWords[itemIdx]
      if (!word) return
      useStore.getState().deleteWord(word.id)
    },
    scrollableContainer
  })

  const getNewWord = (
    id: number,
    text: string,
    categoryId?: number
  ): WordType => {
    return { id, text: capitalizeWords(text), categoryId }
  }

  const createInFastMode = (result?: string) => {
    const texts = (result || newWord).split(',')
    const lastId = findLastId(words)

    const newWords = texts
      .map((text, idx) => getNewWord(lastId + idx + 1, text, category.id))
      .filter((c) => c.text)
      .filter((c) => !filteredWords.find((cat) => cat.text === c.text))

    useStore.setState({ words: [...words, ...newWords] })
  }

  const createInNormalMode = useCallback(() => {
    if (!newWord) {
      toast.error('Word cannot be empty')
      return
    }

    if (filteredWords.find((w) => compareStrings(w.text, newWord))) {
      toast.error('Word in this category already exists')
      inputRef.current?.select()
      return
    }

    const newWordObject = getNewWord(
      findLastId(words) + 1,
      newWord,
      category.id
    )

    useStore.setState({ words: [...words, newWordObject] })
  }, [newWord, category, words, filteredWords])

  const onCreateWord = (result?: string) => {
    settings.fastMode ? createInFastMode(result) : createInNormalMode()

    setNewWord('')
    scrollableContainer.scrollDown()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!newWord && isHotkey(['mod+left', 'ctrl+left'], e)) {
      navigate(-1)
      return
    }

    if (!newWord && isHotkey(['mod+right', 'ctrl+right'], e)) {
      navigate(1)
      return
    }

    if (isHotkey('enter', e)) {
      onCreateWord()
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewWord(event.target.value)
  }

  const voiceInput = useVoiceInput({
    onResult: (result) => {
      if (settings.fastMode) {
        onCreateWord(getTextInMode(result, settings.fastMode))
        return
      }
      setNewWord(result)
    }
  })

  return (
    <PageContainer>
      <ControllableListContext.Provider value={controllableList}>
        <Text variant="button">{category?.name}</Text>
        <Header category={category} />
        <WrappedWords
          scrollableContainer={scrollableContainer}
          filteredWords={filteredWords}
        />
        <SeparatorFull className="my-2" />
        <ControllableListInput
          onKeyDown={onKeyDown}
          data-test="input-new-word"
          type="text"
          placeholder="New word..."
          className="w-full"
          value={newWord}
          onChange={onChange}
          ref={inputRef}
          autoFocus
          voiceInput={voiceInput}
          big
          icon={
            <InputIcons
              onClick={() => onCreateWord()}
              title={'Send (Enter key)'}
            />
          }
          controllableList={controllableList}
          selectedItemText={
            controllableList.selectedIdx !== null
              ? filteredWords[controllableList.selectedIdx]?.text
              : undefined
          }
        />
      </ControllableListContext.Provider>
    </PageContainer>
  )
}

export const CategoryPage = () => {
  const categoryId = useParams<{ id: string }>().id || -1
  const categories = useStore((state) => state.categories)

  const category = categories.find((c) => c.id === +categoryId)

  if (!category) return <Navigate to="/" />

  return <CategoryPageCore category={category} />
}
