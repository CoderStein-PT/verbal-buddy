import moment from 'moment'
import { useCallback, useRef, useState } from 'react'
import { useStore } from 'store'
import { useInterval } from 'usehooks-ts'

export const useGame = ({ onStart }: { onStart?: () => void } = {}) => {
  const [countdown, setCountdown] = useState(0)
  const [isCounting, setIsCounting] = useState(false)
  const [time, setTime] = useState(0)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)
  const [pressedStart, setPressedStart] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const [lastTypingTimestamp, setLastTypingTimestamp] = useState(Date.now())
  const initialTimestamp = useRef(Date.now())
  const settings = useStore((state) => state.settings)

  const displayCountdown = moment.utc(countdown * 1000).format('ss')

  const onKeyDown = useCallback(() => {
    setIsCounting(false)
    clearTimeout(timeoutRef.current)
    if (isCounting) {
      setLastTypingTimestamp(Date.now())
    }

    timeoutRef.current = setTimeout(() => {
      setIsCounting(true)
    }, settings.practiceDelayTolerance * 1000)
  }, [isCounting, setIsCounting, timeoutRef, setLastTypingTimestamp, settings])

  const finish = useCallback(() => {
    setFinished(true)
    setIsCounting(false)
    clearTimeout(timeoutRef.current)
  }, [setFinished, setIsCounting, timeoutRef])

  useInterval(
    () => {
      setCountdown(countdown - 1)

      if (countdown === 1) {
        setStarted(true)
        setIsCounting(true)
        initialTimestamp.current = Date.now()
        setLastTypingTimestamp(Date.now())
        onStart?.()
      }
    },
    pressedStart && countdown > 0 && !started ? 1000 : null
  )

  useInterval(
    () => {
      setTime(time + 100)
    },
    isCounting ? 100 : null
  )

  const reset = useCallback(() => {
    setTime(0)
    setIsCounting(false)
    setFinished(false)
    setStarted(false)
    setPressedStart(false)
    setCountdown(0)
  }, [])

  const startCountdown = useCallback(() => {
    setCountdown(settings.practiceCountdown)
    setPressedStart(true)
  }, [setCountdown, setPressedStart, settings])

  return {
    countdown,
    setCountdown,
    isCounting,
    setIsCounting,
    time,
    setTime,
    finished,
    setFinished,
    started,
    setStarted,
    pressedStart,
    setPressedStart,
    displayCountdown,
    onKeyDown,
    lastTypingTimestamp,
    setLastTypingTimestamp,
    finish,
    initialTimestamp,
    reset,
    startCountdown
  }
}

export type GameType = ReturnType<typeof useGame>
