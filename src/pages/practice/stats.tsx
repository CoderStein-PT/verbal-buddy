import { Text, ScrollableContainer, SeparatorFull, TextProps } from 'components'
import { PracticeStatsType, useStore } from 'store'
import { BetterOrWorse, getIsBetterOrWorse } from 'utils'
import moment from 'moment'

const StatRow = ({
  stat,
  previousStat
}: {
  stat: PracticeStatsType
  previousStat: PracticeStatsType | undefined
}) => {
  const time = moment.utc(stat.delay).format('mm:ss')
  const avg = moment.utc(stat.avgDelayBetweenWords).format('mm:ss')

  const progressColors: Record<BetterOrWorse, TextProps['color']> = {
    better: 'primary',
    worse: 'red',
    same: undefined
  }

  const avgProgress = getIsBetterOrWorse(
    stat.avgDelayBetweenWords,
    previousStat?.avgDelayBetweenWords,
    0.05
  )

  const timeProgress = getIsBetterOrWorse(stat.delay, previousStat?.delay, 0.05)

  return (
    <tr key={stat.timestamp}>
      <td className="flex items-center space-x-1">
        <Text>{moment(stat.timestamp).format('DD.MM.YYYY')}</Text>
        <Text variant="subtitle">{moment(stat.timestamp).format('HH:mm')}</Text>
      </td>
      <td className="text-right">
        <Text color={progressColors[avgProgress]} variant="subtitle">
          {avg}
        </Text>
      </td>
      <td className="text-right">
        <Text variant="subtitle">{stat.wordsCount || 0}</Text>
      </td>
      <td className="text-right">
        <Text color={progressColors[timeProgress]} variant="button">
          {time}
        </Text>
      </td>
    </tr>
  )
}
export const Stats = ({ categoryId }: { categoryId: number }) => {
  const stats = useStore((state) =>
    state.practiceStats.filter((s) => s.categoryId === categoryId)
  )

  if (!stats?.length) return null

  return (
    <div className="flex flex-col">
      <Text variant="button">{'Stats'}</Text>
      <SeparatorFull className="my-2" />
      <ScrollableContainer>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">
                <Text variant="subtitle">{'Date'}</Text>
              </th>
              <th className="text-right">
                <Text variant="subtitle">{'Avg'}</Text>
              </th>
              <th className="text-right">
                <Text variant="subtitle">{'Words'}</Text>
              </th>
              <th className="text-right">
                <Text variant="subtitle">{'Time'}</Text>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 divide-dashed">
            {[...stats].reverse().map((stat, idx) => (
              <StatRow
                stat={stat}
                key={stat.timestamp}
                previousStat={stats[idx - 1]}
              />
            ))}
          </tbody>
        </table>
      </ScrollableContainer>
    </div>
  )
}
