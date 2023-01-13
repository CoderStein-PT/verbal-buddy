import { Text, ScrollableContainer, SeparatorFull } from 'components'
import moment from 'moment'
import { GuessDelayType } from 'store'
import { convertDelays } from 'utils'

const ResultRow = ({ delay }: { delay: GuessDelayType }) => {
  const delayText = moment.utc(delay.delay).format('mm:ss')

  const color = delay.guessed ? 'primary' : 'red'

  return (
    <tr className="relative">
      <td className="">
        <Text color={color}>{delay.word.text}</Text>
      </td>
      <td className="text-right">
        <Text color={color}>{delayText}</Text>
      </td>
    </tr>
  )
}

export const GuessResults = ({ delays }: { delays: GuessDelayType[] }) => {
  const flattenedDelays = delays.map((d) => d.delay)

  const convertedDelays = convertDelays(flattenedDelays)

  const newDelays = delays.map((d, idx) => ({
    ...d,
    delay: convertedDelays[idx]
  }))

  return (
    <div className="flex flex-col">
      <Text variant="button">{'Results'}</Text>
      <SeparatorFull className="my-2" />
      <ScrollableContainer>
        <table className="w-full h-px">
          <thead>
            <tr>
              <th className="text-left">
                <Text variant="subtitle">{'Word'}</Text>
              </th>
              <th className="text-right">
                <Text variant="subtitle">{'Delay'}</Text>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 divide-dashed">
            {newDelays.map((d, idx) => (
              <ResultRow delay={d} key={d.word.id} />
            ))}
          </tbody>
        </table>
      </ScrollableContainer>
    </div>
  )
}
