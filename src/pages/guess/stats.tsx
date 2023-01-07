import { Text, ScrollableContainer, SeparatorFull, TextProps } from 'components'
import { GuessDelayType, GuessStats, useStore } from 'store'
import {
  BetterOrWorse,
  capGraphPointsFrequency,
  getIsBetterOrWorse
} from 'utils'
import moment from 'moment'
import { BarChart, Bar, ResponsiveContainer } from 'recharts'

const DelayGraph = ({ delays }: { delays: GuessDelayType[] }) => {
  const data = capGraphPointsFrequency(
    delays.map((d) => d.delay),
    12
  ).map((d, idx) => ({
    name: idx,
    pv: d
  }))

  return (
    <ResponsiveContainer width={100} height={20}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Bar dataKey="pv" fill="rgb(70,80,100)" barSize={10} />
      </BarChart>
    </ResponsiveContainer>
  )
}

const StatRow = ({
  stat,
  previousStat
}: {
  stat: GuessStats
  previousStat: GuessStats | undefined
}) => {
  const time = moment.utc(stat.totalTime).format('mm:ss')
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

  const timeProgress = getIsBetterOrWorse(
    stat.totalTime,
    previousStat?.totalTime,
    0.05
  )

  return (
    <tr key={stat.timestamp}>
      <td className="flex items-center space-x-1">
        <Text>{moment(stat.timestamp).format('DD.MM.YYYY')}</Text>
        <Text variant="subtitle">{moment(stat.timestamp).format('HH:mm')}</Text>
      </td>
      <td className="text-right">
        {!!stat.delays && <DelayGraph delays={stat.delays} />}
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
export const Stats = () => {
  const stats = useStore((state) => state.guessStats)

  if (!stats?.length) return null

  const reversedStats = [...stats].reverse()

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
              <th className="text-left">
                <Text variant="subtitle">{'Avg Graph'}</Text>
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
            {reversedStats.map((stat, idx) => (
              <StatRow
                stat={stat}
                key={stat.timestamp}
                previousStat={reversedStats[idx + 1]}
              />
            ))}
          </tbody>
        </table>
      </ScrollableContainer>
    </div>
  )
}
