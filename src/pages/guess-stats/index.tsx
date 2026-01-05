import { Button, ProseDiv, SeparatorFull } from 'ui'
import { Stats } from 'pages/guess-stats/stats'
import { Link } from 'react-router-dom'
import { useStore } from 'store'
import { useI18n } from 'i18n'

const Explanation = () => {
  const { t } = useI18n()
  
  return (
    <>
      <h2>{t('guess')}</h2>
      <p>{t('guessIntro')}<br />{t('guessIntroDesc')}</p>
    </>
  )
}

export const GuessStats = () => {
  const { t } = useI18n()
  const stats = useStore((state) => state.guessStats)
  const settings = useStore((state) => state.settings)
  const aiEnabled = settings.useAi && settings.googleAiToken

  const resetStats = () => {
    const confirm = window.confirm(t('areYouSureResetStats'))

    if (!confirm) return

    useStore.setState({ guessStats: [] })
  }

  return (
    <div>
      <SeparatorFull className="my-2" />
      {!!stats.length ? (
        <Stats />
      ) : (
        <ProseDiv className="mx-auto">
          <Explanation />
        </ProseDiv>
      )}
      <SeparatorFull className="my-2" />
      <div
        className={
          'flex space-x-2 ' +
          (!!stats.length ? 'justify-between' : 'justify-end')
        }
      >
        <div className="flex flex-col space-x-0 space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          {!!stats.length && (
            <div>
              <Button color="grayPrimary" size="md" onClick={resetStats}>
                {t('resetStats')}
              </Button>
            </div>
          )}
          <Link to="/guess/difficult-words">
            <Button color="grayPrimary" size="md">
              {t('guessDifficultWords')}
            </Button>
          </Link>
          <div title={!aiEnabled ? t('enableAiInSettings') : ""}>
            <Link to={aiEnabled ? "/guess/reverse" : "#"} onClick={(e) => !aiEnabled && e.preventDefault()}>
              <Button color="grayPrimary" size="md" disabled={!aiEnabled}>
                {t('reverseGuess')}
              </Button>
            </Link>
          </div>
        </div>
        <Link to="/guess/new-game" data-test="btn-new-game">
          <Button size="md">{t('newGame')}</Button>
        </Link>
      </div>
    </div>
  )
}
