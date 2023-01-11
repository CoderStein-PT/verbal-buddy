import { Text } from 'components'

export const Footer = () => {
  return (
    <div className="flex items-end justify-between flex-1 px-4 pt-12 pb-2 md:pt-32 md:pb-12 md:px-0">
      <Text variant="subtitle" color="gray-light">
        © {new Date().getFullYear()} - Verbal Buddy. All rights reserved
      </Text>
      <div className="flex items-center space-x-3">
        <a href="/about#privacy">
          <Text variant="subtitle" color="gray-light">
            {'Privacy Policy'}
          </Text>
        </a>
      </div>
    </div>
  )
}
