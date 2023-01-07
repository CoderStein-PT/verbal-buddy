import {
  Button,
  Input,
  Text,
  ScrollableContainer,
  useScrollableContainer,
  SeparatorFull
} from 'components'
import { CategoryType, useStore } from 'store'
import { convertDelays, findLastId, getAverageDelay } from 'utils'
import { toast } from 'react-toastify'
import { useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useInterval } from 'usehooks-ts'
import moment from 'moment'
import { Stats } from './stats'
import { ProgressBar } from './progress-bar'
import { Words } from './words'

export const PracticePageCore = ({ category }: { category: CategoryType }) => {
  const [isCounting, setIsCounting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const words = useStore((state) => state.words)
  const practice = useStore((state) => state.practice)
  const [countdown, setCountdown] = useState(0)
  const [time, setTime] = useState(0)
  const [delays, setDelays] = useState<number[]>([])
  const categoryWords = words.filter((w) => w.categoryId === category.id)
  const settings = useStore((state) => state.settings)
  const goal = Math.min(categoryWords.length, settings.practiceMaxWords)
  const [guessedAll, setGuessedAll] = useState(false)
  const [started, setStarted] = useState(false)
  const [pressedStart, setPressedStart] = useState(false)

  const initialTimestamp = useRef(Date.now())
  const [lastTypingTimestamp, setLastTypingTimestamp] = useState(Date.now())

  const scrollableContainer = useScrollableContainer({ scrollOnLoad: true })

  const wordsLeft = useMemo(
    () =>
      categoryWords.filter((w) => practice.find((p) => p.text === w.text))
        .length,
    [practice, categoryWords]
  )

  const checkIfGuessedAll = () => {
    const newWordsLeft = categoryWords.filter((w) =>
      useStore.getState().practice.find((p) => p.text === w.text)
    ).length

    if (newWordsLeft !== goal || guessedAll) return

    toast.success('You guessed all words!')
    setGuessedAll(true)
    setIsCounting(false)
    clearTimeout(timeoutRef.current)

    const incorrectWordsCount = categoryWords.filter(
      (w) => !practice.find((p) => p.text === w.text)
    ).length

    useStore.setState((state) => ({
      practiceStats: [
        ...state.practiceStats,
        {
          timestamp: Date.now(),
          delay: time,
          categoryId: category.id,
          avgDelayBetweenWords: getAverageDelay(delays),
          wordsCount: goal,
          incorrectWordsCount: incorrectWordsCount,
          delays: convertDelays(delays)
        }
      ]
    }))
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCounting(false)
    clearTimeout(timeoutRef.current)
    if (isCounting) {
      setLastTypingTimestamp(Date.now())
    }

    timeoutRef.current = setTimeout(() => {
      setIsCounting(true)
    }, settings.practiceDelayTolerance * 1000)

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

    if (categoryWords.find((w) => w.text === newWord)) {
      const newDelay = lastTypingTimestamp - initialTimestamp.current
      setDelays((delays) => [...delays, newDelay])
    }

    event.currentTarget.value = ''
    scrollableContainer.scrollDown()

    checkIfGuessedAll()
  }

  const resetPractice = () => {
    useStore.setState({ practice: [] })
    setTime(0)
    setIsCounting(false)
    setGuessedAll(false)
    setDelays([])
    setStarted(false)
    setPressedStart(false)
    setCountdown(0)
  }

  useInterval(
    () => {
      setTime(time + 100)
    },
    isCounting ? 100 : null
  )

  useInterval(
    () => {
      setCountdown(countdown - 1)

      if (countdown === 1) {
        setStarted(true)
        setIsCounting(true)
        initialTimestamp.current = Date.now()
        setLastTypingTimestamp(Date.now())
      }
    },
    pressedStart && countdown > 0 && !started ? 1000 : null
  )

  const startCountdown = () => {
    resetPractice()
    setCountdown(settings.practiceCountdown)
    setPressedStart(true)
  }

  const displayTime = moment.utc(time).format('mm:ss')
  const displayCountdown = moment.utc(countdown * 1000).format('ss')

  return (
    <div className="flex justify-center">
      <div className="w-full pl-96">
        <div className="w-[400px] mx-auto">
          <div className="flex items-center justify-end">
            <div className="relative flex items-end pl-2 pr-3 space-x-2 border border-gray-700 rounded-xl">
              <Text variant="h4" className="text-right">
                {displayTime}
              </Text>
              <div
                className={`w-2 h-2 rounded-full absolute bottom-1 right-1 ${
                  isCounting ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
          </div>
          <SeparatorFull className="my-2" />
          {started ? (
            <ScrollableContainer scrollableContainer={scrollableContainer}>
              <Words
                checkIfGuessedAll={checkIfGuessedAll}
                category={category}
                categoryWords={categoryWords}
              />
            </ScrollableContainer>
          ) : !!countdown ? (
            <Text variant="h4" className="text-center">
              {displayCountdown}
            </Text>
          ) : (
            <div className="px-4">
              <Text variant="button" className="text-center">
                {category.name}
              </Text>
              <Text color="gray-light" className="text-center">
                {
                  'Type the words you remember from this category as fast as you can! 🔥'
                }
              </Text>
              <SeparatorFull className="my-2" />
              <div>
                <ul className="pl-8 text-white list-disc">
                  <li>
                    <Text
                      color="gray-light"
                      dangerouslySetInnerHTML={{
                        __html:
                          'After typing each word press <b>Enter</b> to add it to the list.'
                      }}
                    />
                  </li>
                  <li>
                    <Text
                      color="gray-light"
                      dangerouslySetInnerHTML={{
                        __html:
                          "You'll see the stats on the right after you guess all the words. Avg is the most important metric as it shows how much time you think between each word on average. Your goal is to improve it over time."
                      }}
                    />
                  </li>
                  <li>
                    <Text color="gray-light">
                      {
                        'If you type a word that is not in this category, it will appear as red (mistake) in the list.'
                      }
                    </Text>
                  </li>
                  <li>
                    <Text
                      color="gray-light"
                      dangerouslySetInnerHTML={{
                        __html:
                          'The timer counts only the time you spend thinking about the words, not the time you spend typing them. The red dot indicates that the timer is paused.'
                      }}
                    />
                  </li>
                  <li>
                    <Text
                      color="gray-light"
                      dangerouslySetInnerHTML={{
                        __html:
                          "If you think the word you typed is correct, but it's not in the list, you can hover over it and click the <b>+</b> button to add it to the list. Also you can correct it by clicking the 'edit' button."
                      }}
                    />
                  </li>
                </ul>
              </div>
            </div>
          )}
          {!pressedStart || guessedAll ? null : (
            <Input
              onKeyDown={started ? onKeyDown : undefined}
              type="text"
              placeholder="New word..."
              autoFocus
              className="w-full mt-2 text-2xl"
            />
          )}
          {started && (
            <div className="mt-4">
              <ProgressBar wordsTotal={goal} wordsLeft={wordsLeft} />
            </div>
          )}
          <div className="flex flex-col mt-2 space-y-2">
            {started && (
              <Button onClick={resetPractice} color="gray">
                {'Reset'}
              </Button>
            )}
            {pressedStart && !guessedAll ? null : (
              <Button onClick={startCountdown}>{'Start'}</Button>
            )}
          </div>
        </div>
      </div>
      <div className="w-[420px] flex-shrink-0">
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

  const categoryWords = useStore((state) =>
    state.words.filter((w) => w.categoryId === +categoryId)
  )

  if (!category) return <Navigate to="/" />

  if (!categoryWords.length) {
    return (
      <div className="text-center">
        <div>
          <Text variant="h4">{'No words to practice'}</Text>
          <Text>{'To practice, add some words to the category'}</Text>
          <div className="flex justify-center mt-2">
            <Link to={`/category/${categoryId}`}>
              <Button className="ml-2">{'Add words'}</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <PracticePageCore category={category} />
}
