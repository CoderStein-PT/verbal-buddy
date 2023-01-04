import { Button, Input, Separator, SeparatorSm, Text } from 'components'
import { useStore, WordType } from 'store'
import { findLastId } from 'utils'
import { toast } from 'react-toastify'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useInterval } from 'usehooks-ts'
import moment from 'moment'

const ProgressBar = ({
  wordsLeft,
  wordsTotal
}: {
  wordsLeft: number
  wordsTotal: number
}) => {
  return (
    <div className="flex items-center">
      <div className="w-full h-4 bg-gray-500 rounded-md">
        <div
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${(wordsLeft / wordsTotal) * 100}%` }}
        />
      </div>
      <div className="ml-2 text-xs font-semibold text-gray-700">
        <Text>
          {wordsLeft}/{wordsTotal}
        </Text>
      </div>
    </div>
  )
}

export const Word = ({ word }: { word: WordType }) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onDeleteWord = () => {
    useStore.setState((state) => ({
      practice: state.practice.filter((w) => w.id !== word.id)
    }))
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const onChangeWord = () => {
    setIsEditMode(false)
    const newWord = inputRef?.current?.value

    if (!newWord) {
      toast.error('Word cannot be empty')
      return
    }

    if (
      useStore
        .getState()
        .practice.find((w) => w.text === newWord && w.id !== word.id)
    ) {
      toast.error('Word already exists')
      return
    }

    useStore.setState((state) => ({
      practice: state.practice.map((w) =>
        w.id === word.id ? { ...w, text: newWord } : w
      )
    }))
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    onChangeWord()
  }

  return (
    <div className="flex justify-between">
      <div className="w-full cursor-pointer group" onClick={toggleEditMode}>
        {isEditMode ? (
          <Input
            className="w-full"
            ref={inputRef}
            onBlur={onChangeWord}
            defaultValue={word.text}
            onKeyDown={onKeyDown}
          />
        ) : (
          <Text className="group-hover:text-green-500">{word.text}</Text>
        )}
      </div>
      <Button onClick={onDeleteWord} size="icon" color="red">
        <RiCloseFill className="w-full h-full" />
      </Button>
    </div>
  )
}

export const Words = () => {
  const words = useStore((state) => state.practice)

  return (
    <div>
      {words.map((word) => (
        <Word key={word.id} word={word} />
      ))}
    </div>
  )
}

const Stats = () => {
  const stats = useStore((state) => state.practiceStats)

  if (!stats.length) return null

  return (
    <div className="flex flex-col">
      <Text variant="button">{'Stats'}</Text>
      <SeparatorSm className="my-4" />

      {[...stats].reverse().map((stat) => (
        <div key={stat.timestamp} className="flex justify-between gap-x-6">
          <Text>{moment(stat.timestamp).format('DD.MM.YYYY HH:mm')}</Text>
          <Text>{moment(stat.delay, 'seconds').format('mm:ss')}</Text>
        </div>
      ))}
    </div>
  )
}

export const PracticePage = () => {
  const categoryId = useParams<{ id: string }>().id

  const category = useStore((state) =>
    state.categories.find((c) => c.id === +categoryId)
  )

  const [isCounting, setIsCounting] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const words = useStore((state) => state.words)
  const practice = useStore((state) => state.practice)
  const [time, setTime] = useState(0)
  const categoryWords = words.filter((w) => w.categoryId === +categoryId)
  const [guessedAll, setGuessedAll] = useState(false)

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCounting(false)
    clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      setIsCounting(true)
    }, 500)

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
    event.currentTarget.value = ''

    const newWordsLeft = categoryWords.filter((w) =>
      useStore.getState().practice.find((p) => p.text === w.text)
    ).length

    if (newWordsLeft === categoryWords.length && !guessedAll) {
      toast.success('You guessed all words!')
      setGuessedAll(true)
      setIsCounting(false)
      clearTimeout(timeoutRef.current)
      useStore.setState((state) => ({
        practiceStats: [
          ...state.practiceStats,
          { timestamp: Date.now(), delay: time }
        ]
      }))
    }
  }

  const wordsLeft = useMemo(
    () =>
      categoryWords.filter((w) => practice.find((p) => p.text === w.text))
        .length,
    [practice, categoryWords]
  )

  const resetPractice = () => {
    useStore.setState({ practice: [] })
    setTime(0)
    setIsCounting(false)
    setTimeout(() => {
      setIsCounting(true)
    }, 0)
    setGuessedAll(false)
  }

  useInterval(
    () => {
      setTime(time + 1)
    },
    isCounting ? 1000 : null
  )

  const displayTime = moment.utc(time * 1000).format('mm:ss')

  return (
    <div className="flex justify-center">
      <div className="w-[320px] mx-auto">
        <Text variant="subtitle">{'Practice category'}</Text>
        <Text variant="button">{category?.name}</Text>
        <SeparatorSm className="my-4" />
        <Words />
        {guessedAll ? null : (
          <Input
            onKeyDown={onKeyDown}
            type="text"
            placeholder="New category..."
            className="w-full mt-2"
          />
        )}
        <div className="mt-2 ">
          <ProgressBar
            wordsTotal={categoryWords.length}
            wordsLeft={wordsLeft}
          />
          <Text>Delay: {displayTime}</Text>
        </div>
        <div className="mt-4">
          <Button onClick={resetPractice}>{'Reset'}</Button>
        </div>
      </div>
      <div>
        <Stats />
      </div>
    </div>
  )
}
