import {
  Button,
  Input,
  Text,
  ScrollableContainer,
  useScrollableContainer,
  Row,
  SeparatorFull
} from 'components'
import { CategoryType, PracticeStatsType, useStore, WordType } from 'store'
import { findLastId } from 'utils'
import { toast } from 'react-toastify'
import { useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useInterval } from 'usehooks-ts'
import moment from 'moment'
import produce from 'immer'
import { HiPlus } from '@react-icons/all-files/hi/HiPlus'

const ProgressBar = ({
  wordsLeft,
  wordsTotal
}: {
  wordsLeft: number
  wordsTotal: number
}) => {
  return (
    <div className="flex items-center">
      <div className="relative w-full h-5 overflow-hidden bg-gray-800 border border-gray-600 rounded-lg">
        <div
          className="relative h-full transition duration-300 origin-left bg-primary-500"
          style={{ transform: `scaleX(${wordsLeft / wordsTotal})` }}
        />
      </div>
      <div className="ml-2 font-semibold text-gray-700">
        <Text>
          {wordsLeft}/{wordsTotal}
        </Text>
      </div>
    </div>
  )
}

export const Word = ({
  word,
  categoryWords,
  index,
  category
}: {
  word: WordType
  categoryWords: WordType[]
  index?: number
  category: CategoryType
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
      index={index}
      actions={
        isGuessed
          ? []
          : [
              {
                icon: HiPlus,
                title: 'Add to category',
                onClick: () => {
                  useStore.setState((state) =>
                    produce(state, (draft) => {
                      draft.words.push({
                        id: findLastId(draft.words) + 1,
                        text: word.text,
                        categoryId: category.id
                      })
                    })
                  )
                }
              }
            ]
      }
    />
  )
}

export const Words = ({
  categoryWords,
  category
}: {
  categoryWords: WordType[]
  category: CategoryType
}) => {
  const words = useStore((state) => state.practice)

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

const StatRow = ({ stat }: { stat: PracticeStatsType }) => {
  return (
    <div
      key={stat.timestamp}
      className="flex items-center justify-between gap-x-6"
    >
      <Text>{moment(stat.timestamp).format('DD.MM.YYYY HH:mm')}</Text>
      <Text variant="button">
        {moment.utc(stat.delay * 1000).format('mm:ss')}
      </Text>
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
      <SeparatorFull className="my-2" />
      <ScrollableContainer>
        <div className="divide-y divide-gray-700 divide-dashed">
          {[...stats].reverse().map((stat) => (
            <StatRow stat={stat} key={stat.timestamp} />
          ))}
        </div>
      </ScrollableContainer>
    </div>
  )
}

export const PracticePageCore = ({ category }: { category: CategoryType }) => {
  const [isCounting, setIsCounting] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const words = useStore((state) => state.words)
  const practice = useStore((state) => state.practice)
  const [time, setTime] = useState(0)
  const [avgDelayBetweenWords, setAvgDelayBetweenWords] = useState(0)
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
          {
            timestamp: Date.now(),
            delay: time,
            categoryId: category.id,
            avgDelayBetweenWords
          }
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
  const displayAvgDelayBetweenWords = moment
    .utc(avgDelayBetweenWords * 1000)
    .format('mm:ss')

  return (
    <div className="flex justify-center">
      <div className="w-full pl-64">
        <div className="w-[400px] mx-auto">
          <div className="flex items-center justify-between">
            <Text variant="button">{category?.name}</Text>
            <div className="flex items-end space-x-2">
              <Text variant="h4" className="text-right">
                {displayTime}
              </Text>
              {/* display a small red dot if the user is not currently typing */}
              <div
                className={`w-2 h-2 rounded-full ${
                  isCounting ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
          </div>
          <SeparatorFull className="my-2" />
          <ScrollableContainer scrollableContainer={scrollableContainer}>
            <Words category={category} categoryWords={categoryWords} />
          </ScrollableContainer>
          {guessedAll ? null : (
            <Input
              onKeyDown={onKeyDown}
              type="text"
              placeholder="New word..."
              autoFocus
              className="w-full mt-2 text-2xl"
            />
          )}
          <div className="mt-4">
            <ProgressBar wordsTotal={goal} wordsLeft={wordsLeft} />
          </div>
          <div className="flex flex-col mt-2">
            <Button onClick={resetPractice}>{'Reset'}</Button>
          </div>
          <Text variant="subtitle" className="text-right">
            Average Delay: {displayAvgDelayBetweenWords}
          </Text>
        </div>
      </div>
      <div className="w-[280px] flex-shrink-0">
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
