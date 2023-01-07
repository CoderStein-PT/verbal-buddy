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
import { useRef, useState } from 'react'
import { getRandomWord } from 'utils'
import { Timer } from 'pages/practice/timer'

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
  if (!word.descriptions || word.descriptions.length === 0) return null

  const shuffledDescriptions = [...word.descriptions].sort(
    () => 0.5 - Math.random()
  )

  return (
    <ScrollableContainer>
      {shuffledDescriptions.map((d, index) => (
        <Description key={d.id} description={d} index={index + 1} />
      ))}
    </ScrollableContainer>
  )
}

export const GuessPage = () => {
  const words = useStore((s) => s.words)
  const navigate = useNavigate()

  const wordsWithD = words.filter(
    (w) => w.descriptions && !!w.descriptions.length
  )

  if (!wordsWithD.length)
    return (
      <div className="mx-auto w-[600px]">
        <Text>
          {'You need at least 3 words with descriptions to play this game.'}
        </Text>
        <SeparatorFull className="my-4" />
        <div className="mt-4">
          <Button onClick={() => navigate('/')}>{'Define Descriptions'}</Button>
        </div>
      </div>
    )

  return <GuessPageCore words={wordsWithD} />
}

export const GuessPageCore = ({ words }: { words: WordType[] }) => {
  const navigate = useNavigate()
  const [word, setWord] = useState<WordType>(getRandomWord({ words }))

  const [countdown, setCountdown] = useState(0)
  const [isCounting, setIsCounting] = useState(false)
  const [time, setTime] = useState(0)
  const [delays, setDelays] = useState<number[]>([])
  const [guessedAll, setGuessedAll] = useState(false)
  const [started, setStarted] = useState(false)
  const [pressedStart, setPressedStart] = useState(false)
  const initialTimestamp = useRef(Date.now())
  const [lastTypingTimestamp, setLastTypingTimestamp] = useState(Date.now())

  return (
    <div className="mx-auto w-[600px]">
      <div className="flex justify-end">
        <Timer time={2000} />
      </div>
      <SeparatorFull className="my-4" />
      <Descriptions word={word} />
      <SeparatorFull className="my-4" />
      <div className="mt-4">
        <Button onClick={() => navigate('/jokes/new')}>{'Start'}</Button>
      </div>
    </div>
  )
}
