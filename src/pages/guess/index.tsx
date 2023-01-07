import { Row, Text, ScrollableContainer, Button } from 'components'
import { useStore, DescriptionType, WordType, GuessDelayType } from 'store'
import { useMemo, useState } from 'react'
import { convertDelays, getAverageDelay, getRandomWord } from 'utils'
import { Timer } from 'pages/practice/timer'
import { Placeholder } from './placeholder'
import { Footer } from 'pages/practice/footer'
import { useGame } from 'pages/practice/use-game'
import { Explanation } from './explanation'
import { Stats } from './stats'

const Description = ({
  description,
  index
}: {
  description: DescriptionType
  index: number
}) => {
  return <Row text={description.text} index={index} />
}

const Descriptions = ({ word }: { word: WordType }) => {
  const shuffledDescriptions = useMemo(() => {
    if (!word.descriptions || word.descriptions.length === 0) return null

    return [...word.descriptions].sort(() => 0.5 - Math.random())
  }, [word.descriptions])

  if (!shuffledDescriptions) return null

  return (
    <ScrollableContainer>
      {shuffledDescriptions.map((d, index) => (
        <Description key={d.id} description={d} index={index + 1} />
      ))}
    </ScrollableContainer>
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

  const rotateWord = (newGuessedWords: WordType[]) => {
    const newRandomWord = getRandomWord({
      words: words.filter(
        (w) =>
          !newGuessedWords.find((gw) => gw.text === w.text) &&
          !skippedWords.find((sw) => sw.text === w.text)
      )
    })

    setWord(newRandomWord)
  }

  const checkIfFinished = (
    newGuessedWords: WordType[],
    newSkippedWords: WordType[],
    lastTypingTimestamp: number
  ) => {
    const newDelay = lastTypingTimestamp - game.initialTimestamp.current
    const newDelays = [...delays, { delay: newDelay, word }]
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

    const newWord = event.currentTarget.value.toLowerCase()

    if (newWord !== word.text) return

    const newGuessedWords = [...guessedWords, word]

    setGuessedWords(newGuessedWords)

    checkIfFinished(newGuessedWords, skippedWords, game.lastTypingTimestamp)
    event.currentTarget.value = ''
  }

  const skipWord = () => {
    const newSkippedWords = [...skippedWords, word]
    setSkippedWords(newSkippedWords)
    checkIfFinished(guessedWords, newSkippedWords, Date.now())
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
          <div className="flex justify-end">
            <Timer time={game.time} isCounting={game.isCounting} />
          </div>
          {game.started ? (
            <ScrollableContainer>
              <Descriptions word={word} />
            </ScrollableContainer>
          ) : !!game.countdown ? (
            <Text variant="h4" className="text-center">
              {game.displayCountdown}
            </Text>
          ) : (
            <Explanation />
          )}
          <Footer
            game={game}
            goal={goal}
            onChange={onChange}
            resetPractice={resetPractice}
            wordsLeft={guessedWords.length + skippedWords.length}
            startCountdown={startCountdown}
          />
          {game.started && !game.finished && (
            <div className="flex justify-end">
              <Button className="mt-2" color="gray" onClick={skipWord}>
                {'Skip Word'}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="w-[420px] flex-shrink-0">
        <Stats />
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
