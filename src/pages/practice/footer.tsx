import { Button, Input } from 'components'
import { ProgressBar } from './progress-bar'
import { GameType } from './use-game'

export const Footer = ({
  game,
  goal,
  onKeyDown,
  resetPractice,
  startCountdown,
  wordsLeft
}: {
  game: GameType
  goal: number
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  resetPractice: () => void
  startCountdown: () => void
  wordsLeft: number
}) => {
  return (
    <>
      {!game.pressedStart || game.finished ? null : (
        <Input
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
}
