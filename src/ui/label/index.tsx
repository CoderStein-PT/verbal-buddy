import tw from 'tailwind-styled-components'
import { Text } from 'ui'

export const Label = tw((props) => (
  <Text variant="subtitle" color="no" {...props} />
))`w-full mb-1 text-gray-500 dark:text-gray-400`
