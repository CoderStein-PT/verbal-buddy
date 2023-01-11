import { Row, Text, ScrollableContainer, Button } from 'components'
import { useStore, DescriptionType, WordType, GuessDelayType } from 'store'
import { useEffect, useMemo, useState } from 'react'
import {
  compareStrings,
  convertDelays,
  getAverageDelay,
  getRandomWord
} from 'utils'
import { Timer } from 'pages/practice/timer'
import { Placeholder } from './placeholder'
import { Footer } from 'pages/practice/footer'
import { useGame } from 'pages/practice/use-game'
import Explanation from './explanation.mdx'
import { Stats } from './stats'
import { GuessResults } from './guess-results'
import { PageContainer } from 'components/layout/container'
import { Link } from 'react-router-dom'

const Description = ({
  description,
  index
}: {
  description: DescriptionType
  index: number
}) => {
  return <Row text={description.text} index={index} />
}

const shuffleArray = (array: any[]) => {
  return [...array].sort(() => 0.5 - Math.random())
}

const Descriptions = ({
  word,
  descriptionCount
}: {
  word: WordType
  descriptionCount: number
}) => {
  const processedDescriptions = useMemo(() => {
    if (!word.descriptions || word.descriptions.length === 0) return null

    return shuffleArray(word.descriptions)
  }, [word.descriptions])

  if (!processedDescriptions) return null

  return (
    <div className="p-2 mt-2 border border-gray-600 rounded-md">
      <ScrollableContainer>
        <div className="divide-y divide-gray-600 divide-dashed">
          {processedDescriptions.slice(0, descriptionCount).map((d, index) => (
            <Description key={d.id} description={d} index={index + 1} />
          ))}
        </div>
      </ScrollableContainer>
    </div>
  )
}

export const GuessPageCore = ({ words }: { words: WordType[] }) => {
  const [word, setWord] = useState<WordType>(() => getRandomWord({ words }))
  const settings = useStore((s) => s.settings)
  const [guessedWords, setGuessedWords] = useState<WordType[]>([])
  const goal = Math.min(words.length, settings.guessMaxWords)
  const game = useGame()
  const [skippedWords, setSkippedWords] = useState<WordType[]>([])
  const [delays, setDelays] = useState<GuessDelayType[]>([])
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
    const delayObject: GuessDelayType = {
      delay: lastTypingTimestamp - game.initialTimestamp.current,
      word,
      guessed: !skipped
    }
    const newDelays = [...delays, delayObject]
    setDelays(newDelays)

    if (newGuessedWords.length + newSkippedWords.length < goal) {
      rotateWord(newGuessedWords)
      return
    }

    const flattenedDelays = newDelays.map((d) => d.delay)

    const convertedDelays = convertDelays(flattenedDelays)

    const newConvertedDelays = convertedDelays.map((delay, index) => ({
      delay,
      word: newDelays[index].word
    }))

    game.finish()
    setLastWord(word)
    useStore.setState({
      guessStats: [
        ...useStore.getState().guessStats,
        {
          timestamp: Date.now(),
          totalTime: game.time,
          avgDelayBetweenWords: getAverageDelay(flattenedDelays),
          wordsCount: newGuessedWords.length,
          delays: newConvertedDelays
        }
      ]
    })
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
      <div className="w-full md:pl-64">
        <PageContainer>
          <div className="flex justify-end">
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
            <div className="prose dark:prose-invert prose-slate">
              <Explanation />
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            {showHintsButton ? (
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
            ) : (
              <div></div>
            )}
            <div
              className={`flex items-center justify-end ${
                showLastWord
                  ? 'opacity-100 transition'
                  : 'opacity-0 scale-0 transition duration-300'
              }`}
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
            <Link className="flex flex-col" to={`/guess/stats`}>
              <Button color="gray">{'See Stats'}</Button>
            </Link>
          </div>
        </PageContainer>
      </div>
      <div className="md:block hidden w-[360px] flex-shrink-0">
        {game.finished || !game.pressedStart ? (
          <Stats />
        ) : (
          <GuessResults delays={delays} />
        )}
      </div>
    </div>
  )
}

export const GuessPage = () => {
  const words = useStore((s) => s.words)

  const wordsWithD = words.filter(
    (w) => w.descriptions && !!w.descriptions.length
  )

  if (!wordsWithD.length) return <Placeholder />

  return <GuessPageCore words={wordsWithD} />
}
