import { Text, ScrollableContainer, Button, ProseDiv } from 'components'
import { useStore, WordType, GuessWordType } from 'store'
import { useEffect, useState } from 'react'
import {
  calculateMultipleDelays,
  compareStrings,
  convertDelays,
  findLastId,
  getAverageDelay,
  getRandomWord
} from 'utils'
import { Timer } from 'pages/practice/timer'
import { Placeholder } from './placeholder'
import { Footer } from 'pages/practice/footer'
import { useGame } from 'pages/practice/use-game'
import Explanation from './explanation.mdx'
import { GuessResults } from './guess-results'
import { PageContainer } from 'components/layout/container'
import { Navigate, Link, useParams } from 'react-router-dom'
import { Descriptions } from './descriptions'
import { toast } from 'react-toastify'

export const GuessPageCore = ({ words }: { words: WordType[] }) => {
  const [word, setWord] = useState<WordType>(() => getRandomWord({ words }))
  const categories = useStore((s) => s.categories)
  const settings = useStore((s) => s.settings)
  const [guessedWords, setGuessedWords] = useState<WordType[]>([])
  const goal = Math.min(words.length, settings.guessMaxWords)
  const game = useGame()
  const [skippedWords, setSkippedWords] = useState<WordType[]>([])
  const [delays, setDelays] = useState<GuessWordType[]>([])
  const [lastWord, setLastWord] = useState<WordType | null>(null)
  const [showLastWord, setShowLastWord] = useState(false)
  const [hintsLeft, setHintsLeft] = useState(10)
  const [descriptionCount, setDescriptionCount] = useState(3)

  useEffect(() => {
    if (!lastWord) return

    setShowLastWord(true)

    const timeout = setTimeout(() => {
      setShowLastWord(false)
    }, 4000)

    return () => clearTimeout(timeout)
  }, [lastWord])

  const rotateWord = (newGuessedWords: WordType[]) => {
    const newRandomWord = getRandomWord({
      words: words.filter(
        (w) =>
          !newGuessedWords.find((gw) => gw.text === w.text) &&
          !skippedWords.find((sw) => sw.text === w.text)
      )
    })

    setLastWord(word)
    resetDescriptionCount()

    setWord(newRandomWord)
  }

  const checkIfFinished = (
    newGuessedWords: WordType[],
    newSkippedWords: WordType[],
    lastTypingTimestamp: number,
    skipped = false
  ) => {
    const wordObject: GuessWordType = {
      delay: lastTypingTimestamp - game.initialTimestamp.current,
      wordId: word.id,
      guessed: !skipped
    }

    const newWords = [...delays, wordObject]
    setDelays(newWords)

    if (newGuessedWords.length + newSkippedWords.length < goal) {
      rotateWord(newGuessedWords)
      return
    }

    const flattenedDelays = newWords.map((d) => d.delay)

    const convertedDelays = convertDelays(flattenedDelays)

    const newConvertedDelays = convertedDelays.map((delay, index) => ({
      delay,
      wordId: newWords[index].wordId
    }))

    game.finish()
    toast.success('Game finished!')
    setLastWord(word)
    useStore.setState((state) => ({
      guessStats: [
        ...state.guessStats,
        {
          id: findLastId(state.guessStats) + 1,
          timestamp: Date.now(),
          totalTime: game.time,
          avgDelayBetweenWords: getAverageDelay(flattenedDelays),
          wordsCount: newGuessedWords.length,
          words: newConvertedDelays
        }
      ]
    }))
  }

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    game.onKeyDown()

    const newWord = event.currentTarget.value

    if (!compareStrings(newWord, word.text)) return

    const newGuessedWords = [...guessedWords, word]

    setGuessedWords(newGuessedWords)

    checkIfFinished(newGuessedWords, skippedWords, game.lastTypingTimestamp)
    event.currentTarget.value = ''
  }

  const skipWord = () => {
    const newSkippedWords = [...skippedWords, word]
    setSkippedWords(newSkippedWords)
    checkIfFinished(guessedWords, newSkippedWords, Date.now(), true)
  }

  const resetPractice = () => {
    useStore.setState({ practice: [] })
    setDelays([])
    setGuessedWords([])
    setSkippedWords([])
    game.reset()
  }

  const startCountdown = () => {
    resetPractice()
    game.startCountdown()
  }

  const moreDescriptions = () => {
    setDescriptionCount(descriptionCount + 1)
    setHintsLeft(hintsLeft - 1)
  }

  const resetDescriptionCount = () => {
    setDescriptionCount(3)
  }

  const showHintsButton =
    game.started && descriptionCount < (word?.descriptions?.length || 0)

  return (
    <div className="flex justify-center">
      <div className="w-full">
        <PageContainer>
          <div
            className="hidden"
            data-test="data-word"
            data-test-data={word.text}
            data-test-finished={game.finished}
          />
          <div className="flex items-center justify-between">
            <Text>
              {categories.find((c) => c.id === word.categoryId)?.name}
            </Text>
            <Timer time={game.time} isCounting={game.isCounting} />
          </div>
          {game.started ? (
            <>
              <ScrollableContainer height={200}>
                <Descriptions descriptionCount={descriptionCount} word={word} />
              </ScrollableContainer>
            </>
          ) : !!game.countdown ? (
            <div className="h-[200px] flex justify-center items-center">
              <Text variant="h4" className="text-center">
                {game.displayCountdown}
              </Text>
            </div>
          ) : (
            <ProseDiv>
              <Explanation />
            </ProseDiv>
          )}
          <div
            className={`flex items-center mt-2 ${
              showHintsButton ? 'justify-between' : 'justify-end'
            }`}
          >
            {showHintsButton && (
              <Button
                size="sm"
                disabled={hintsLeft < 1}
                color="gray"
                onClick={moreDescriptions}
              >
                {hintsLeft > 0
                  ? 'Show more (' + hintsLeft + 'x)'
                  : 'No Hints Left'}
              </Button>
            )}
            <div
              className={`flex items-center justify-end ${
                showLastWord
                  ? 'opacity-100 transition'
                  : 'opacity-0 scale-0 transition duration-300'
              }`}
              data-test="last-word-text"
            >
              <Text variant="subtitle2">{lastWord?.text || '...'}</Text>
            </div>
          </div>
          <Footer
            game={game}
            goal={goal}
            onChange={onChange}
            resetPractice={resetPractice}
            wordsLeft={guessedWords.length + skippedWords.length}
            startCountdown={startCountdown}
            skipWord={skipWord}
            placeholder="Guess word"
          />
          <div className="flex flex-col mt-2 md:hidden">
            <Link className="flex flex-col" to={`/guess`}>
              <Button color="gray">{'See Stats'}</Button>
            </Link>
          </div>
        </PageContainer>
      </div>
      <div className="md:block hidden w-[360px] flex-shrink-0">
        <GuessResults delays={delays} />
      </div>
    </div>
  )
}

export const GuessPlayPage = () => {
  const categoryIds = useParams<{ categoryIds: string }>().categoryIds
  const words = useStore((s) => s.words)
  const stats = useStore((s) => s.guessStats)

  if (!categoryIds) return <Navigate to="/guess" />

  const isDifficultWords = categoryIds === 'difficult-words'

  const difficultWords = calculateMultipleDelays(stats).slice(0, 50)

  const wordsFiltered = words.filter(
    (w) =>
      w?.descriptions?.length &&
      (isDifficultWords
        ? difficultWords.find((dw) => dw.wordId === w.id)
        : categoryIds.split(',').includes(w.categoryId + ''))
  )

  if (!wordsFiltered.length) return <Placeholder />

  return <GuessPageCore words={wordsFiltered} />
}
