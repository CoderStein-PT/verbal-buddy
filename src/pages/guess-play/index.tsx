import { Text, Button, ProseDiv } from 'ui'
import { ScrollableContainer, PageContainer, Timer } from 'components'
import { useStore, WordType, GuessWordType } from 'store'
import { useEffect, useState } from 'react'
import {
  compareStrings,
  convertDelays,
  findLastId,
  getAverageDelay,
  getRandomWord,
  pronounce
} from 'utils'
import { Placeholder } from './placeholder'
import { Footer } from 'pages/practice/footer'
import { useGame } from 'pages/practice/use-game'
import Explanation from './explanation.mdx'
import { GuessResults } from './guess-results'
import { Navigate, Link, useParams } from 'react-router-dom'
import { Definitions } from './definitions'
import { toast } from 'react-toastify'
import { useVoiceInput } from 'components/scrollable-container/use-voice-input'
import { getMostDifficultWords } from 'pages/guess-stats/stats'
import { checkWordWithAI } from 'utils/ai'

export const GuessPageCore = ({ words }: { words: WordType[] }) => {
  const [word, setWord] = useState<WordType>(() => getRandomWord({ words }))
  const categories = useStore((s) => s.categories)
  const settings = useStore((s) => s.settings)
  const [guessedWords, setGuessedWords] = useState<WordType[]>([])
  const goal = Math.min(words.length, settings.guessMaxWords)
  const game = useGame({ onStart: () => pronounceWordDefinitions(word) })
  const [skippedWords, setSkippedWords] = useState<WordType[]>([])
  const [delays, setDelays] = useState<GuessWordType[]>([])
  const [lastWord, setLastWord] = useState<WordType | null>(null)
  const [showLastWord, setShowLastWord] = useState(false)
  const [hintsLeft, setHintsLeft] = useState(10)
  const [descriptionCount, setDescriptionCount] = useState(3)
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
    resetDescriptionCount()

    setWord(newRandomWord)

    pronounceWordDefinitions(newRandomWord)
  }

  const pronounceWordDefinitions = (word: WordType) => {
    const definitions = word?.definitions

    if (settings.guessPronounceDefinitions && definitions?.length) {
      pronounce(definitions.map((d) => d.text).join(', '))
    }
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

  const checkInWord = async (
    newWord: string,
    throwIfIncorrect?: boolean,
    newLastTimestamp?: number
  ) => {
    if (settings.useAi && settings.googleAiToken && throwIfIncorrect) {
      setIsChecking(true)
      try {
        const definition = word.definitions?.[0]?.text || ''
        const result = await checkWordWithAI(
          settings.googleAiToken,
          settings.googleAiModel || 'gemini-2.0-flash-exp',
          newWord,
          word.text,
          definition
        )

        if (!result.correct) {
          toast.error(result.explanation || 'Incorrect word')
          if (settings.practiceVoiceFeedback) {
            pronounce(result.explanation || 'Incorrect')
          }
          setIsChecking(false)
          return
        }
      } catch (e) {
        console.error(e)
        toast.error('AI check failed, falling back to exact match')
      } finally {
        setIsChecking(false)
      }
    } else if (!compareStrings(newWord, word.text)) {
      if (throwIfIncorrect) {
        toast.error('Incorrect word')
        if (settings.practiceVoiceFeedback) {
          pronounce('Incorrect')
        }
      }
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

    // Only check exact match on typing, AI check is too slow for every keystroke
    // AI check will only happen on "Enter" or voice input which usually triggers throwIfIncorrect=true logic if we wire it up
    // But wait, onChange is called on every keystroke. We shouldn't await AI here.
    // We should only check if it matches exactly here.
    if (!settings.useAi && compareStrings(event.currentTarget.value, word.text)) {
      checkInWord(event.currentTarget.value)
    }
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      checkInWord(game.currentWord, true, Date.now())
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

  const moreDefinitions = () => {
    setDescriptionCount(descriptionCount + 1)
    setHintsLeft(hintsLeft - 1)
  }

  const resetDescriptionCount = () => {
    setDescriptionCount(3)
  }

  const voiceInput = useVoiceInput({
    onResult: (result) => {
      game.setLastTypingTimestamp(Date.now())
      checkInWord(result, true, Date.now())
    }
  })

  const showHintsButton =
    game.started && descriptionCount < (word?.definitions?.length || 0)

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
                <Definitions descriptionCount={descriptionCount} word={word} />
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
                color="grayPrimary"
                onClick={moreDefinitions}
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
            onKeyDown={onKeyDown}
            resetPractice={resetPractice}
            wordsLeft={guessedWords.length + skippedWords.length}
            startCountdown={startCountdown}
            skipWord={skipWord}
            placeholder="Guess word"
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

export const GuessPlayPage = () => {
  const categoryIds = useParams<{ categoryIds: string }>().categoryIds
  const words = useStore((s) => s.words)
  const stats = useStore((s) => s.guessStats)

  if (!categoryIds) return <Navigate to="/guess" />

  const isDifficultWords = categoryIds === 'difficult-words'

  const difficultWords = getMostDifficultWords(stats, words)

  const wordsFiltered = words.filter(
    (w) =>
      w?.definitions?.length &&
      (isDifficultWords
        ? difficultWords.find((dw) => dw.wordId === w.id)
        : categoryIds.split(',').includes(w.categoryId + ''))
  )

  if (!wordsFiltered.length) return <Placeholder />

  return <GuessPageCore words={wordsFiltered} />
}
