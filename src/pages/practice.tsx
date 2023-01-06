import {
  Button,
  Input,
  SeparatorSm,
  Text,
  ScrollableContainer,
  useScrollableContainer,
  Row
} from 'components'
import { CategoryType, useStore, WordType } from 'store'
import { findLastId } from 'utils'
import { toast } from 'react-toastify'
import { useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useInterval } from 'usehooks-ts'
import moment from 'moment'
import produce from 'immer'

const ProgressBar = ({
  wordsLeft,
  wordsTotal
}: {
  wordsLeft: number
  wordsTotal: number
}) => {
  return (
    <div className="flex items-center">
      <div className="w-full h-4 bg-gray-500 rounded-md">
        <div
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${(wordsLeft / wordsTotal) * 100}%` }}
        />
      </div>
      <div className="ml-2 text-xs font-semibold text-gray-700">
        <Text>
          {wordsLeft}/{wordsTotal}
        </Text>
      </div>
    </div>
  )
}

export const Word = ({
  word,
  categoryWords
}: {
  word: WordType
  categoryWords: WordType[]
}) => {
  const isGuessed = useMemo(
    () => !!categoryWords.find((w) => w.text === word.text),
    [categoryWords, word]
  )

  const onChangeWord = (text: string | undefined) => {
    if (!text) {
      toast.error('Word cannot be empty')
      return
    }

    const practice = useStore.getState().practice

    if (practice.find((w) => w.text === text && w.id !== word.id)) {
      toast.error('Word already exists')
      return
    }

    useStore.setState((state) =>
      produce(state, (draft) => {
        const currentWord = draft.practice.find((w) => w.id === word.id)

        if (!currentWord) return

        currentWord.text = text
      })
    )
  }

  return (
    <Row
      text={word.text}
      color={isGuessed ? undefined : 'red'}
      onChange={onChangeWord}
    />
  )
}

export const Words = ({ categoryWords }: { categoryWords: WordType[] }) => {
  const words = useStore((state) => state.practice)

  return (
    <div>
      {words.map((word) => (
        <Word categoryWords={categoryWords} key={word.id} word={word} />
      ))}
    </div>
  )
}

const Stats = ({ categoryId }: { categoryId: number }) => {
  const stats = useStore((state) =>
    state.practiceStats.filter((s) => s.categoryId === categoryId)
  )

  if (!stats?.length) return null

  return (
    <div className="flex flex-col">
      <Text variant="button">{'Stats'}</Text>
      <SeparatorSm className="my-4" />

      {[...stats].reverse().map((stat) => (
        <div key={stat.timestamp} className="flex justify-between gap-x-6">
          <Text>{moment(stat.timestamp).format('DD.MM.YYYY HH:mm')}</Text>
          <Text>{moment.utc(stat.delay * 1000).format('mm:ss')}</Text>
        </div>
      ))}
    </div>
  )
}

export const PracticePageCore = ({ category }: { category: CategoryType }) => {
  const [isCounting, setIsCounting] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const words = useStore((state) => state.words)
  const practice = useStore((state) => state.practice)
  const [time, setTime] = useState(0)
  const categoryWords = words.filter((w) => w.categoryId === category.id)
  const settings = useStore((state) => state.settings)
  const goal = Math.min(categoryWords.length, settings.practiceMaxWords)
  const [guessedAll, setGuessedAll] = useState(false)

  const scrollableContainer = useScrollableContainer({ scrollOnLoad: true })

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCounting(false)
    clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      setIsCounting(true)
    }, 500)

    if (event.key !== 'Enter') return

    const newWord = event.currentTarget.value

    if (!newWord) return toast.error('Word cannot be empty')

    if (useStore.getState().practice.find((w) => w.text === newWord))
      return toast.error('Word already exists')

    useStore.setState((state) => ({
      practice: [
        ...(state.practice || []),
        { id: findLastId(state.practice) + 1, text: newWord }
      ]
    }))
    event.currentTarget.value = ''
    scrollableContainer.scrollContainerDown()

    const newWordsLeft = categoryWords.filter((w) =>
      useStore.getState().practice.find((p) => p.text === w.text)
    ).length

    if (newWordsLeft === goal && !guessedAll) {
      toast.success('You guessed all words!')
      setGuessedAll(true)
      setIsCounting(false)
      clearTimeout(timeoutRef.current)
      useStore.setState((state) => ({
        practiceStats: [
          ...state.practiceStats,
          { timestamp: Date.now(), delay: time, categoryId: category.id }
        ]
      }))
    }
  }

  const wordsLeft = useMemo(
    () =>
      categoryWords.filter((w) => practice.find((p) => p.text === w.text))
        .length,
    [practice, categoryWords]
  )

  const resetPractice = () => {
    useStore.setState({ practice: [] })
    setTime(0)
    setIsCounting(false)
    setTimeout(() => {
      setIsCounting(true)
    }, 0)
    setGuessedAll(false)
  }

  useInterval(
    () => {
      setTime(time + 1)
    },
    isCounting ? 1000 : null
  )

  const displayTime = moment.utc(time * 1000).format('mm:ss')

  return (
    <div className="flex justify-center">
      <div className="w-[320px] mx-auto">
        <Text variant="button">{category?.name}</Text>
        <SeparatorSm className="my-4" />
        <ScrollableContainer scrollableContainer={scrollableContainer}>
          <Words categoryWords={categoryWords} />
        </ScrollableContainer>
        {guessedAll ? null : (
          <Input
            onKeyDown={onKeyDown}
            type="text"
            placeholder="New word..."
            className="w-full mt-2"
          />
        )}
        <div className="mt-2 ">
          <ProgressBar wordsTotal={goal} wordsLeft={wordsLeft} />
          <Text>Delay: {displayTime}</Text>
        </div>
        <div className="mt-4">
          <Button onClick={resetPractice}>{'Reset'}</Button>
        </div>
      </div>
      <div>
        <Stats categoryId={category.id} />
      </div>
    </div>
  )
}

export const PracticePage = () => {
  const categoryId = useParams<{ id: string }>().id || -1

  const category = useStore((state) =>
    state.categories.find((c) => c.id === +categoryId)
  )

  if (!category) return null

  return <PracticePageCore category={category} />
}
