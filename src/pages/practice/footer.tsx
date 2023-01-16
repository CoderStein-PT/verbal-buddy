import { Button, Input } from 'ui'
import { ChangeEventHandler } from 'react'
import { ProgressBar } from './progress-bar'
import { GameType } from './use-game'

export const Footer = ({
  game,
  goal,
  onChange,
  onKeyDown,
  resetPractice,
  startCountdown,
  wordsLeft,
  skipWord,
  placeholder
}: {
  game: GameType
  goal: number
  onChange?: ChangeEventHandler<HTMLInputElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  resetPractice: () => void
  startCountdown: () => void
  wordsLeft: number
  skipWord?: () => void
  placeholder?: string
}) => (
  <>
    {!game.pressedStart || game.finished ? null : (
      <>
        <Input
          onChange={game.started ? onChange : undefined}
          onKeyDown={game.started ? onKeyDown : undefined}
          type="text"
          placeholder={placeholder || 'New word...'}
          autoFocus
          data-test="input-game"
          big
          className="w-full mt-2 text-center"
        />
      </>
    )}
    {game.started && (
      <div className="mt-4">
        <ProgressBar wordsTotal={goal} wordsLeft={wordsLeft} />
      </div>
    )}
    <div className="flex mt-2 space-x-2">
      {game.started && (
        <Button className="w-full" onClick={resetPractice} color="gray">
          {'Reset'}
        </Button>
      )}
      {skipWord && game.started && !game.finished && (
        <Button className="w-full" color="gray" onClick={skipWord}>
          {'Skip Word'}
        </Button>
      )}
      {game.pressedStart && !game.finished ? null : (
        <Button
          className="w-full"
          onClick={startCountdown}
          data-test="btn-game-start"
        >
          {'Start'}
        </Button>
      )}
    </div>
  </>
)
