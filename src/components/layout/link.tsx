import { Text } from 'ui'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { LinkType } from './links-list'

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
          className="p-2"
          ref={ref}
          onMouseEnter={() => onMouseEnter?.(link.name)}
          onMouseLeave={onMouseLeave}
        >
          {link.icon ? (
            <link.icon
              className={`transition ${
                active ? 'text-primary-500' : 'text-slate-200'
              }`}
            />
          ) : (
            <Text variant="button" color={active ? 'primary' : undefined}>
              {link.name}
            </Text>
          )}
        </div>
      </RouterLink>
    )
  }
)
