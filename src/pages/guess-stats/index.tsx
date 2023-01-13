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
          'flex ' + (!!stats.length ? 'justify-between' : 'justify-end')
        }
      >
        {!!stats.length && (
          <Button color="gray" size="md" onClick={resetStats}>
            {'Reset Stats'}
          </Button>
        )}
        <Link to="/guess/new-game">
          <Button>{'New Game'}</Button>
        </Link>
      </div>
    </div>
  )
}
