import { Text, TextProps } from 'components'
import { GiAcorn } from '@react-icons/all-files/gi/GiAcorn'

export const Logo = ({ size }: { size?: TextProps['variant'] }) => {
  return (
    <div className="relative flex items-center space-x-2 cursor-pointer group">
      <div>
        <GiAcorn className="transition w-7 h-7 text-primary-800 group-hover:text-primary-500" />
      </div>
      <Text
        className="relative z-10 group-hover:text-primary-500"
        variant={size || 'h6'}
      >
        {'Verbal Buddy'}
      </Text>
    </div>
  )
}
