import {
  Button,
  Row,
  SeparatorFull,
  Text,
  ScrollableContainer
} from 'components'
import { useStore, JokeType, DescriptionType, WordType } from 'store'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { useNavigate } from 'react-router-dom'
import { useMemo, useRef, useState } from 'react'
import { getAverageDelay, getRandomWord } from 'utils'
import { Timer } from 'pages/practice/timer'
import { Placeholder } from './placeholder'
import { Footer } from 'pages/practice/footer'
import { useGame } from 'pages/practice/use-game'
import { Explanation } from './explanation'

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
  const [delays, setDelays] = useState<number[]>([])

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    game.onKeyDown()

    const newWord = event.currentTarget.value.toLowerCase()

    if (newWord !== word.text) return

    const newGuessedWords = [...guessedWords, word]

    setGuessedWords(newGuessedWords)

    event.currentTarget.value = ''
    setDelays((prev) => [...prev, game.time])

    if (newGuessedWords.length !== goal) {
      const newRandomWord = getRandomWord({
        words: words.filter(
          (w) => !newGuessedWords.find((gw) => gw.text === w.text)
        )
      })

      setWord(newRandomWord)
      return
    }

    game.finish()
    useStore.setState({
      guessStats: [
        ...useStore.getState().guessStats,
        {
          timestamp: Date.now(),
          totalTime: game.time,
          avgDelayBetweenWords: getAverageDelay(delays),
          wordsCount: newGuessedWords.length,
          delays: newGuessedWords.map((word, i) => ({ delay: delays[i], word }))
        }
      ]
    })
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
    <div className="mx-auto w-[600px]">
      <div className="flex justify-end">
        <Timer time={2000} />
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
        wordsLeft={guessedWords.length}
        startCountdown={startCountdown}
      />
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
