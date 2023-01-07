import { Text } from 'components'

export const ProgressBar = ({
  wordsLeft,
  wordsTotal
}: {
  wordsLeft: number
  wordsTotal: number
}) => {
  return (
    <div className="flex items-center">
      <div className="relative w-full h-5 overflow-hidden bg-gray-800 border border-gray-600 rounded-lg">
        <div
          className="relative h-full transition duration-300 origin-left bg-primary-500"
          style={{ transform: `scaleX(${wordsLeft / wordsTotal})` }}
        />
      </div>
      <div className="ml-2 font-semibold text-gray-700">
        <Text>
          {wordsLeft}/{wordsTotal}
        </Text>
      </div>
    </div>
  )
}
