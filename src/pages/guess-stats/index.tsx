import { Button, ProseDiv, SeparatorFull } from 'components'
import { Stats } from 'pages/guess-stats/stats'
import { Link } from 'react-router-dom'
import { useStore } from 'store'
import Explanation from './explanation.mdx'

export const GuessStats = () => {
  const stats = useStore((state) => state.guessStats)

  const resetStats = () => {
    const confirm = window.confirm('Are you sure you want to reset stats?')

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
              <Button color="gray" size="md" onClick={resetStats}>
                {'Reset Stats'}
              </Button>
            </div>
          )}
          <Link to="/guess/difficult-words">
            <Button size="md">{'Guess difficult words'}</Button>
          </Link>
        </div>
        <Link to="/guess/new-game" data-test="btn-new-game">
          <Button>{'New Game'}</Button>
        </Link>
      </div>
    </div>
  )
}
