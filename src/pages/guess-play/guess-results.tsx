import { ScrollableContainer } from 'components'
import { Text, SeparatorFull } from 'ui'
import moment from 'moment'
import { GuessWordType, useStore, WordType } from 'store'
import { convertDelays } from 'utils'
import { useI18n } from 'i18n'

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

const Header = () => {
  const { t } = useI18n()
  
  return (
    <thead className="border-b border-slate-500">
      <tr>
        <th className="text-left">
          <Text variant="subtitle2">{t('word')}</Text>
        </th>
        <th className="text-right">
          <Text variant="subtitle2">{t('delay')}</Text>
        </th>
      </tr>
    </thead>
  )
}

export const GuessResults = ({ delays }: { delays: GuessWordType[] }) => {
  const { t } = useI18n()
  const flattenedDelays = delays.map((d) => d.delay)
  const words = useStore((state) => state.words)

  const convertedDelays = convertDelays(flattenedDelays)

  const newDelays = delays.map((d, idx) => ({
    ...d,
    delay: convertedDelays[idx]
  }))

  return (
    <div className="flex flex-col">
      <Text variant="button">{t('results')}</Text>
      <SeparatorFull className="my-2" />
      <ScrollableContainer>
        <table className="w-full h-px">
          <Header />
          <tbody
            className="divide-y divide-gray-700 divide-dashed"
            data-test="game-results-list"
          >
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
