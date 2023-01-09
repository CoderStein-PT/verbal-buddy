import { Text } from 'components'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { LinkType } from './links'

// eslint-disable-next-line react/display-name
export const Link = React.forwardRef<any, any>(
  (
    {
      link,
      active,
      onMouseEnter,
      onMouseLeave
    }: {
      link: LinkType
      active?: boolean
      onMouseEnter?: (name: string) => void
      onMouseLeave?: () => void
    },
    ref
  ) => {
    return (
      <RouterLink to={link.link}>
        <div
          className="px-2"
          ref={ref}
          onMouseEnter={() => onMouseEnter?.(link.name)}
          onMouseLeave={onMouseLeave}
        >
          <Text variant="button" color={active ? 'primary' : undefined}>
            {link.name}
          </Text>
        </div>
      </RouterLink>
    )
  }
)
