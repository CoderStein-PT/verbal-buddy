import {
  ScrollableContainer,
  useScrollableContainer,
  PageContainer,
  Timer
} from 'components'
import { Text, SeparatorFull, Button, ProseDiv } from 'ui'
import { CategoryType, useStore, WordType } from 'store'
import {
  capitalizeWords,
  compareStrings,
  convertDelays,
  findLastId,
  getAverageDelay,
  pronounce,
  removeDuplicates
} from 'utils'
import { toast } from 'react-toastify'
import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Stats } from './stats'
import { Words } from './words'
import Explanation from './explanation.mdx'
import { useGame } from './use-game'
import { Footer } from './footer'
import { Placeholder } from './placeholder'
import { useVoiceInput } from 'components/scrollable-container/use-voice-input'

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
      categoryWords.filter((w) =>
        practice.find((p) => compareStrings(p.text, w.text))
      ).length,
    [practice, categoryWords]
  )

  const endGame = () => {
    game.finish()
    toast.success('You guessed all the words!')
    const incorrectWordsCount = categoryWords.filter(
      (w) => !practice.find((p) => compareStrings(p.text, w.text))
    ).length

    useStore.setState((state) => ({
      practiceStats: [
        ...state.practiceStats,
        {
          timestamp: Date.now(),
          delay: game.time,
          categoryId: category.id,
          avgDelayBetweenWords: getAverageDelay(delays),
          wordsCount: practice.length,
          incorrectWordsCount: incorrectWordsCount,
          delays: convertDelays(delays)
        }
      ]
    }))
  }

  const checkIfFinished = () => {
    const newWordsLeft = categoryWords.filter((w) =>
      useStore.getState().practice.find((p) => compareStrings(p.text, w.text))
    ).length

    if (newWordsLeft < goal || game.finished) return

    if (settings.practiceVoiceFeedback)
      pronounce('Great, you guessed all the words')

    endGame()
  }

  const getNewPractice = (id: number, text: string): WordType => {
    return { id, text: capitalizeWords(text) }
  }

  const createInNormalMode = (result = game.currentWord.trim()) => {
    if (!result) return toast.error('Word cannot be empty')
    const practice = useStore.getState().practice

    if (practice.find((w) => w.text === result)) {
      if (settings.practiceVoiceFeedback) pronounce('Word already exists')
      return toast.error('Word already exists')
    }

    useStore.setState({
      practice: [
        ...(practice || []),
        getNewPractice(findLastId(practice) + 1, result)
      ]
    })

    const found = categoryWords.find((w) => compareStrings(w.text, result))

    if (settings.practiceVoiceFeedback) pronounce(found ? 'Yes' : 'No')

    if (found) {
      const newDelay = game.lastTypingTimestamp - game.initialTimestamp.current
      setDelays((delays) => [...delays, newDelay])
    }
  }

  const createInFastMode = (result?: string) => {
    const words = (result || game.currentWord).split(' ').filter((w) => w)
    const lastId = findLastId(practice)

    const newPractice = removeDuplicates(
      words
        .map((word, idx) => getNewPractice(lastId + idx + 1, word))
        .filter((c) => c.text)
        .filter((c) => !practice.find((cat) => cat.text === c.text))
    )

    const correctWords = newPractice.filter((w) =>
      categoryWords.find((c) => compareStrings(c.text, w.text))
    ).length

    const incorrectWords = newPractice.filter(
      (w) => !categoryWords.find((c) => compareStrings(c.text, w.text))
    )

    if (settings.practiceVoiceFeedback) {
      if (words.length === 1) {
        const found = categoryWords.find((w) =>
          compareStrings(w.text, words[0])
        )
        pronounce(found ? 'Yes' : 'No')
      } else {
        pronounce(
          correctWords === words.length
            ? 'All correct'
            : correctWords === 0
            ? 'None correct'
            : incorrectWords.length > 8
            ? 'Many incorrect'
            : incorrectWords.map((w) => w.text).join(', ') + ' incorrect'
        )
      }
    }

    useStore.setState({ practice: [...practice, ...newPractice] })
  }

  const onCreate = (result?: string) => {
    settings.inputMode === 'single'
      ? createInFastMode(result)
      : createInNormalMode(result)

    game.setCurrentWord('')
    scrollableContainer.scrollDown()

    checkIfFinished()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    game.onKeyDown()

    if (event.key !== 'Enter') return

    onCreate()
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

  const voiceInput = useVoiceInput({
    onResult: (result) => {
      game.setCurrentWord(result)
      game.setLastTypingTimestamp(Date.now())
      if (settings.inputMode === 'normal') return

      onCreate(result)
    }
  })

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    game.setCurrentWord(event.target.value)
  }

  return (
    <div className="flex justify-center">
      <div className="w-full md:pl-48">
        <PageContainer>
          <div className="flex items-end justify-between">
            <Text variant="button" className="text-center">
              {category.name}
            </Text>
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
            <ProseDiv>
              <Explanation />
            </ProseDiv>
          )}
          <Footer
            game={game}
            startCountdown={startCountdown}
            goal={goal}
            wordsLeft={wordsLeft}
            onKeyDown={onKeyDown}
            resetPractice={resetPractice}
            onEndClick={endGame}
            voiceInput={voiceInput}
            onChange={onChange}
          />
          <div className="flex flex-col mt-2 md:hidden">
            <Link
              className="flex flex-col"
              to={`/practice/${category.id}/stats`}
            >
              <Button color="grayPrimary">{'See Stats'}</Button>
            </Link>
          </div>
        </PageContainer>
      </div>
      <div className="md:block hidden w-[390px] flex-shrink-0">
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
