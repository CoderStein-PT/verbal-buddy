import { Text, ScrollableContainer, SeparatorFull } from 'components'
import moment from 'moment'
import { GuessWordType, useStore, WordType } from 'store'
import { convertDelays } from 'utils'

const ResultRow = ({
  delay,
  word
}: {
  delay: GuessWordType
  word: WordType
}) => {
  const delayText = moment.utc(delay.delay).format('mm:ss')

  const color = delay.guessed ? undefined : 'red'

  return (
    <tr className="relative">
      <td className="">
        <Text color={color}>{word.text}</Text>
      </td>
      <td className="text-right">
        <Text color={color}>{delayText}</Text>
      </td>
    </tr>
  )
}

const Header = () => (
  <thead className="border-b border-slate-500">
    <tr>
      <th className="text-left">
        <Text variant="subtitle2">{'Word'}</Text>
      </th>
      <th className="text-right">
        <Text variant="subtitle2">{'Delay'}</Text>
      </th>
    </tr>
  </thead>
)

export const GuessResults = ({ delays }: { delays: GuessWordType[] }) => {
  const flattenedDelays = delays.map((d) => d.delay)
  const words = useStore((state) => state.words)

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
          <Header />
          <tbody className="divide-y divide-gray-700 divide-dashed">
            {newDelays.map((d) => (
              <ResultRow
                delay={d}
                word={words.find((w) => w.id === d.wordId)}
                key={d.wordId}
              />
            ))}
          </tbody>
        </table>
      </ScrollableContainer>
    </div>
  )
}
