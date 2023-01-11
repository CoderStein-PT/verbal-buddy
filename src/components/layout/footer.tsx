import { Text } from 'components'

export const Footer = () => {
  return (
    <div className="flex items-end justify-between flex-1 pt-32 pb-12">
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
