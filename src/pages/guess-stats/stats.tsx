import {
  Text,
  ScrollableContainer,
  SeparatorFull,
  TextProps,
  Button
} from 'components'
import { GuessWordType, GuessStats, useStore } from 'store'
import {
  BetterOrWorse,
  calculateMultipleDelays,
  capGraphPointsFrequency,
  getIsBetterOrWorse,
  isMobile,
  WordWithAvgDelay
} from 'utils'
import moment from 'moment'
import { BarChart, Bar, ResponsiveContainer } from 'recharts'
import { Tab } from '@headlessui/react'
import React, { useState } from 'react'

const DelayGraph = ({ delays }: { delays: GuessWordType[] }) => {
  const data = capGraphPointsFrequency(
    delays.map((d) => d.delay),
    12
  ).map((d, idx) => ({
    name: idx,
    pv: d
  }))

  return (
    <ResponsiveContainer height={'100%'}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Bar
          isAnimationActive={false}
          dataKey="pv"
          fill="rgb(70,80,100)"
          barSize={1000}
        />
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
    <tr className="relative cursor-pointer">
      <td>
        <Text>{stat.id}</Text>
      </td>
      <td className="flex items-end space-x-1">
        <Text>{moment(stat.timestamp).format('DD.MM.YYYY')}</Text>
        <Text variant="subtitle" color="gray-light">
          {moment(stat.timestamp).format('HH:mm')}
        </Text>
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
        <Text color={progressColors[timeProgress]}>{time}</Text>
      </td>
    </tr>
  )
}

const StatsTable = ({ stats }: { stats: GuessStats[] }) => {
  return (
    <div>
      <Text variant="button">{'Stats'}</Text>
      <SeparatorFull className="my-2" />
      <ScrollableContainer>
        <table className="w-full h-px">
          <thead>
            <tr>
              <th className="text-left">
                <Text variant="subtitle">{'ID'}</Text>
              </th>
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
            {stats.map((stat, idx) => (
              <StatRow
                stat={stat}
                key={stat.timestamp}
                previousStat={stats[idx + 1]}
              />
            ))}
          </tbody>
        </table>
      </ScrollableContainer>
    </div>
  )
}

const WordRow = ({
  word,
  index
}: {
  word: WordWithAvgDelay & { text: string }
  index: number
}) => {
  const [showText, setShowText] = useState(false)

  const onToggleShow = () => {
    setShowText(!showText)
  }

  const onTurnOnShow = () => {
    setShowText(true)
  }

  const onTurnOffShow = () => {
    setShowText(false)
  }

  return (
    <tr key={word.wordId}>
      <td className="w-6">
        <Text>{index}</Text>
      </td>
      <td
        className="cursor-pointer"
        onMouseEnter={!isMobile() ? onTurnOnShow : undefined}
        onMouseLeave={!isMobile() ? onTurnOffShow : undefined}
        onClick={isMobile() ? onToggleShow : undefined}
      >
        <Text color={showText ? undefined : 'gray-light'}>
          {showText
            ? word.text
            : '[' + (isMobile() ? 'Click' : 'Hover') + ' to reveal]'}
        </Text>
      </td>
      <td className="text-right">
        <Text>{moment(word.avgDelay).format('mm:ss')}</Text>
      </td>
    </tr>
  )
}

const MostDifficultWords = ({ stats }: { stats: GuessStats[] }) => {
  const words = useStore((s) => s.words)

  const sortedWords = calculateMultipleDelays(stats)
    .slice(0, 50)
    .map((w) => ({
      ...w,
      text: words.find((word) => word.id === w.wordId)?.text || ''
    }))
    .sort((a, b) => b.avgDelay - a.avgDelay)

  return (
    <div>
      <Text variant="button">{'Most difficult words'}</Text>
      <SeparatorFull className="my-2" />
      <ScrollableContainer>
        <table className="w-full h-px">
          <thead>
            <tr>
              <th className="text-left">
                <Text variant="subtitle">{'#'}</Text>
              </th>
              <th className="text-left">
                <Text variant="subtitle">{'Word'}</Text>
              </th>
              <th className="text-right">
                <Text variant="subtitle">{'Avg delay'}</Text>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 divide-dashed">
            {sortedWords.map((word, idx) => (
              <WordRow word={word} index={idx + 1} key={word.wordId} />
            ))}
          </tbody>
        </table>
      </ScrollableContainer>
    </div>
  )
}

export const StatsDesktop = ({ stats }: { stats: GuessStats[] }) => {
  return (
    <div className="flex flex-col">
      <div className="flex space-x-4">
        <div className="w-full">
          <StatsTable stats={stats} />
        </div>
        <div className="w-full">
          <MostDifficultWords stats={stats} />
        </div>
      </div>
    </div>
  )
}

export const StatsMobile = ({ stats }: { stats: GuessStats[] }) => {
  return (
    <Tab.Group>
      <Tab.List className="flex px-2 mt-2 space-x-1 overflow-x-auto">
        <Tab as={React.Fragment}>
          {({ selected }) => (
            <Button size="sm" color={selected ? 'gray' : undefined}>
              {'Stats'}
            </Button>
          )}
        </Tab>
        <Tab as={React.Fragment}>
          {({ selected }) => (
            <Button size="sm" color={selected ? 'gray' : undefined}>
              {'Most Difficult Words'}
            </Button>
          )}
        </Tab>
      </Tab.List>
      <SeparatorFull className="my-2" />
      <Tab.Panels>
        <Tab.Panel>
          <StatsTable stats={stats} />
        </Tab.Panel>
        <Tab.Panel>
          <MostDifficultWords stats={stats} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}

export const Stats = () => {
  const stats = useStore((state) => state.guessStats)

  if (!stats?.length) return null

  const reversedStats = [...stats].reverse()

  if (isMobile()) return <StatsMobile stats={reversedStats} />

  return <StatsDesktop stats={reversedStats} />
}
