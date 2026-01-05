import { Button, InputIcons, InputWithVoice } from 'ui'
import { ChangeEventHandler } from 'react'
import { ProgressBar } from './progress-bar'
import { GameType } from './use-game'
import { VoiceInputType } from 'components/scrollable-container/use-voice-input'
import { useI18n } from 'i18n'

export const Footer = ({
  game,
  goal,
  onChange,
  onKeyDown,
  resetPractice,
  startCountdown,
  wordsLeft,
  skipWord,
  placeholder,
  onEndClick,
  voiceInput
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
  onEndClick?: () => void
  voiceInput?: VoiceInputType
}) => {
  const { t } = useI18n()
  
  return (
  <>
    {!game.pressedStart || game.finished ? null : (
      <div className="mt-2">
        <InputWithVoice
          value={game.currentWord}
          onChange={onChange}
          onKeyDown={onKeyDown}
          type="text"
          placeholder={placeholder || t('newWord')}
          autoFocus
          data-test="input-game"
          big
          voiceInput={voiceInput}
          icon={<InputIcons onClick={() => {}} title={'Send (Enter key)'} />}
        />
      </div>
    )}
    {game.started && (
      <div className="mt-4">
        <ProgressBar wordsTotal={goal} wordsLeft={wordsLeft} />
      </div>
    )}
    <div className="flex mt-2 space-x-2">
      {game.started && (
        <>
          <Button
            className="w-full"
            onClick={resetPractice}
            color="grayPrimary"
          >
            {t('reset')}
          </Button>
          {!game.finished && !!onEndClick && (
            <Button className="w-full" onClick={onEndClick} color="red">
              {t('end')}
            </Button>
          )}
        </>
      )}
      {skipWord && game.started && !game.finished && (
        <Button className="w-full" color="grayPrimary" onClick={skipWord}>
          {t('skipWord')}
        </Button>
      )}
      {game.pressedStart && !game.finished ? null : (
        <Button
          className="w-full"
          onClick={startCountdown}
          data-test="btn-game-start"
        >
          {t('start')}
        </Button>
      )}
    </div>
  </>
  )
}
