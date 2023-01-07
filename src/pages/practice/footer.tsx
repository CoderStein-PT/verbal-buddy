import { Button, Input } from 'components'
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
  wordsLeft
}: {
  game: GameType
  goal: number
  onChange?: ChangeEventHandler<HTMLInputElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  resetPractice: () => void
  startCountdown: () => void
  wordsLeft: number
}) => (
  <>
    {!game.pressedStart || game.finished ? null : (
      <Input
        onChange={game.started ? onChange : undefined}
        onKeyDown={game.started ? onKeyDown : undefined}
        type="text"
        placeholder="New word..."
        autoFocus
        className="w-full mt-2 text-2xl"
      />
    )}
    {game.started && (
      <div className="mt-4">
        <ProgressBar wordsTotal={goal} wordsLeft={wordsLeft} />
      </div>
    )}
    <div className="flex flex-col mt-2 space-y-2">
      {game.started && (
        <Button onClick={resetPractice} color="gray">
          {'Reset'}
        </Button>
      )}
      {game.pressedStart && !game.finished ? null : (
        <Button onClick={startCountdown}>{'Start'}</Button>
      )}
    </div>
  </>
)
