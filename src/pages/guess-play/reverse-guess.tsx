import { Text, Button, ProseDiv } from 'ui'
import { ScrollableContainer, PageContainer, Timer } from 'components'
import { useStore, WordType, GuessWordType } from 'store'
import { useEffect, useState } from 'react'
import {
  convertDelays,
  findLastId,
  getAverageDelay,
  getRandomWord,
  pronounce
} from 'utils'
import { Placeholder } from './placeholder'
import { Footer } from 'pages/practice/footer'
import { useGame } from 'pages/practice/use-game'
import { GuessResults } from './guess-results'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useVoiceInput } from 'components/scrollable-container/use-voice-input'
import { checkDefinitionWithAI } from 'utils/ai'
import { googleAiModels } from 'pages/settings'

export const ReverseGuessPageCore = ({ words }: { words: WordType[] }) => {
  const [word, setWord] = useState<WordType>(() => getRandomWord({ words }))
  const categories = useStore((s) => s.categories)
  const settings = useStore((s) => s.settings)
  const [guessedWords, setGuessedWords] = useState<WordType[]>([])
  const goal = Math.min(words.length, settings.guessMaxWords)
  const game = useGame({ onStart: () => pronounce(word.text) })
  const [skippedWords, setSkippedWords] = useState<WordType[]>([])
  const [delays, setDelays] = useState<GuessWordType[]>([])
  const [lastWord, setLastWord] = useState<WordType | null>(null)
  const [showLastWord, setShowLastWord] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

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

    setWord(newRandomWord)

    pronounce(newRandomWord.text)
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
      wordId: newWords[index].wordId,
      guessed: newWords[index].guessed
    }))

    game.finish()
    toast.success('Game finished!')
    if (settings.practiceVoiceFeedback) {
      pronounce('Game finished!')
    }
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

  const checkDefinition = async (
    userDefinition: string,
    throwIfIncorrect?: boolean,
    newLastTimestamp?: number
  ) => {
    if (settings.useAi && settings.googleAiToken) {
      setIsChecking(true)
      try {
        const result = await checkDefinitionWithAI(
          settings.googleAiToken,
          settings.googleAiModel || googleAiModels[0].value,
          word.text,
          word.definitions?.[0]?.text || '',
          userDefinition
        )

        if (!result.correct) {
          toast.error(result.explanation || 'Incorrect definition')
          if (settings.practiceVoiceFeedback) {
            pronounce(result.explanation || 'Incorrect')
          }
          setIsChecking(false)
          return
        }
      } catch (e) {
        console.error(e)
        toast.error('AI check failed')
        setIsChecking(false)
        return
      } finally {
        setIsChecking(false)
      }
    } else {
        // Should not happen as we disable the button if AI is not setup
        toast.error("AI not configured")
        return
    }

    const newGuessedWords = [...guessedWords, word]

    setGuessedWords(newGuessedWords)

    checkIfFinished(
      newGuessedWords,
      skippedWords,
      newLastTimestamp || game.lastTypingTimestamp
    )
    game.setCurrentWord('')
  }

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    game.onKeyDown()
    game.setCurrentWord(event.currentTarget.value)
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      checkDefinition(game.currentWord, true, Date.now())
    }
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

  const voiceInput = useVoiceInput({
    onResult: (result) => {
      console.log("result", result)
      game.setLastTypingTimestamp(Date.now())
      checkDefinition(result, true, Date.now())
    }
  })

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
            <div className="h-[200px] flex flex-col justify-center items-center">
                <Text variant="h2" className="text-center mb-4">
                    {word.text}
                </Text>
                <Text className="text-center text-gray-500">
                    Say the definition...
                </Text>
                {isChecking && <Text className="text-center text-blue-500 mt-2">Checking...</Text>}
            </div>
          ) : !!game.countdown ? (
            <div className="h-[200px] flex justify-center items-center">
              <Text variant="h4" className="text-center">
                {game.displayCountdown}
              </Text>
            </div>
          ) : (
            <ProseDiv>
              <h3>Reverse Guess Mode</h3>
              <p>In this mode, you will see a word and you need to explain its meaning.</p>
              <p>Speak clearly and try to define the word as best as you can.</p>
              <p>AI will verify your definition.</p>
            </ProseDiv>
          )}
          <div
            className={`flex items-center mt-2 justify-end`}
          >
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
            onKeyDown={onKeyDown}
            resetPractice={resetPractice}
            wordsLeft={guessedWords.length + skippedWords.length}
            startCountdown={startCountdown}
            skipWord={skipWord}
            placeholder="Type definition..."
            voiceInput={voiceInput}
          />
          <div className="flex flex-col mt-2 md:hidden">
            <Link className="flex flex-col" to={`/guess`}>
              <Button color="grayPrimary">{'See Stats'}</Button>
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

export const ReverseGuessPlayPage = () => {
  const words = useStore((s) => s.words)
  
  // Filter words that have definitions, just to be safe, although we don't show them
  const wordsFiltered = words.filter((w) => w?.definitions?.length)

  if (!wordsFiltered.length) return <Placeholder />

  return <ReverseGuessPageCore words={wordsFiltered} />
}
