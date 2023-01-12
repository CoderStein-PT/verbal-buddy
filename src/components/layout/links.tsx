import { matchPath, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { Link } from './link'
import { links } from './links-list'
import { useDecoration, Decoration } from './decorations'

export const Links = () => {
  const location = useLocation()

  const decoration = useDecoration()

  const active = useMemo(() => {
    return links.find((link) => {
      const matches = link.matches || [link.link]
      return matches.some((match) => matchPath(match, location.pathname))
    })
  }, [location.pathname])

  return (
    <div className="relative items-center hidden md:flex">
      {links.map((link) => (
        <Link
          ref={decoration.setRefFromKey(link.name)}
          link={link}
          key={link.link}
          active={active?.name === link.name}
          onMouseEnter={decoration.onMouseEnter}
          onMouseLeave={decoration.onMouseLeave}
        />
      ))}
      <Decoration decoration={decoration} />
    </div>
  )
}
