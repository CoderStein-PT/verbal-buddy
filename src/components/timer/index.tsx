import { Text } from 'ui'
import moment from 'moment'

export const Timer = ({
  time,
  isCounting
}: {
  time: number
  isCounting?: boolean
}) => {
  const displayTime = moment.utc(time).format('mm:ss')

  return (
    <div className="relative inline-block pl-2 pr-3 space-x-2 border border-gray-700 rounded-xl">
      <Text variant="h4" className="text-right">
        {displayTime}
      </Text>
      <div
        className={`w-2 h-2 rounded-full absolute bottom-1 right-1 ${
          isCounting ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
    </div>
  )
}
