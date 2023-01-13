import { PageContainer } from 'components/layout/container'
import { Text } from 'components'
import { Stats } from 'pages/guess-play/stats'

export const GuessStats = () => {
  return (
    <PageContainer>
      <Text variant="h6" className="mb-4 text-center">
        {'Guess Games'}
      </Text>
      <Stats />
    </PageContainer>
  )
}
