import {
  Button,
  Text,
  ScrollableContainer,
  useScrollableContainer,
  SeparatorFull
} from 'components'
import { CategoryType, useStore } from 'store'
import { convertDelays, findLastId, getAverageDelay } from 'utils'
import { toast } from 'react-toastify'
import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Stats } from './stats'
import { Words } from './words'
import { Timer } from './timer'
import { Explanation } from './explanation'
import { useGame } from './use-game'
import { Footer } from './footer'
import { Placeholder } from './placeholder'

export const PracticePageCore = ({ category }: { category: CategoryType }) => {
  const words = useStore((state) => state.words)
  const practice = useStore((state) => state.practice)

  const game = useGame()

  const [delays, setDelays] = useState<number[]>([])
  const categoryWords = words.filter((w) => w.categoryId === category.id)
  const settings = useStore((state) => state.settings)
  const goal = Math.min(categoryWords.length, settings.practiceMaxWords)

  const scrollableContainer = useScrollableContainer({ scrollOnLoad: true })

  const wordsLeft = useMemo(
    () =>
      categoryWords.filter((w) => practice.find((p) => p.text === w.text))
        .length,
    [practice, categoryWords]
  )

  const checkIfFinished = () => {
    const newWordsLeft = categoryWords.filter((w) =>
      useStore.getState().practice.find((p) => p.text === w.text)
    ).length

    if (newWordsLeft !== goal || game.finished) return

    game.finish()
    toast.success('You guessed all words!')

    const incorrectWordsCount = categoryWords.filter(
      (w) => !practice.find((p) => p.text === w.text)
    ).length

    useStore.setState((state) => ({
      practiceStats: [
        ...state.practiceStats,
        {
          timestamp: Date.now(),
          delay: game.time,
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
    game.onKeyDown()

    if (event.key !== 'Enter') return

    const newWord = event.currentTarget.value

    if (!newWord) return toast.error('Word cannot be empty')
    const practice = useStore.getState().practice

    if (practice.find((w) => w.text === newWord))
      return toast.error('Word already exists')

    useStore.setState(() => {
      const newPractice = { id: findLastId(practice) + 1, text: newWord }
      return { practice: [...(practice || []), newPractice] }
    })

    if (categoryWords.find((w) => w.text === newWord)) {
      const newDelay = game.lastTypingTimestamp - game.initialTimestamp.current
      setDelays((delays) => [...delays, newDelay])
    }

    event.currentTarget.value = ''
    scrollableContainer.scrollDown()

    checkIfFinished()
  }

  const resetPractice = () => {
    useStore.setState({ practice: [] })
    setDelays([])
    game.reset()
  }

  const startCountdown = () => {
    resetPractice()
    game.startCountdown()
  }

  return (
    <div className="flex justify-center">
      <div className="w-full pl-96">
        <div className="w-[400px] mx-auto">
          <div className="">
            <Timer time={game.time} isCounting={game.isCounting} />
          </div>
          <SeparatorFull className="my-2" />
          {game.started ? (
            <ScrollableContainer scrollableContainer={scrollableContainer}>
              <Words
                checkIfFinished={checkIfFinished}
                category={category}
                categoryWords={categoryWords}
              />
            </ScrollableContainer>
          ) : !!game.countdown ? (
            <Text variant="h4" className="text-center">
              {game.displayCountdown}
            </Text>
          ) : (
            <Explanation category={category} />
          )}
          <Footer
            game={game}
            startCountdown={startCountdown}
            goal={goal}
            wordsLeft={wordsLeft}
            onKeyDown={onKeyDown}
            resetPractice={resetPractice}
          />
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

  if (!categoryWords.length) return <Placeholder categoryId={category.id} />

  return <PracticePageCore category={category} />
}
