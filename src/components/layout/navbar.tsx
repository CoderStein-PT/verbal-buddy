import { Button, Text } from 'components'
import {
  matchPath,
  useNavigate,
  Link as RouterLink,
  useLocation
} from 'react-router-dom'
import { routes } from 'pages'
import { useMemo, useRef } from 'react'
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft'
import { Link } from './link'
import { links } from './links'
import React from 'react'
import { Logo } from './logo'
import tw from 'tailwind-styled-components'

const useRefs = () => {
  const refs = useRef<Record<string, HTMLElement | null>>({})

  const setRefFromKey = (key: string) => (element: HTMLElement | null) => {
    refs.current[key] = element
  }

  return { refs: refs.current, setRefFromKey }
}

const LinkGlow = tw.div`absolute w-[100px] h-0.5 left-0 transition origin-left ease-cool bg-gradient-to-r from-transparent via-primary-500 to-transparent`

export const Links = () => {
  const { refs, setRefFromKey } = useRefs()

  const location = useLocation()

  const [showBox, setShowBox] = React.useState(false)
  const [left, setLeft] = React.useState(0)
  const [scaleX, setScaleX] = React.useState(1)

  const active = useMemo(() => {
    return links.find((link) => {
      const matches = link.matches || [link.link]
      return matches.some((match) => matchPath(match, location.pathname))
    })
  }, [links, location.pathname])

  const onMouseEnter = (name: string) => {
    const target = refs[name]

    if (!target) return

    const left = target.offsetLeft
    const width = target.offsetWidth

    setScaleX(width / 100)
    setLeft(left)

    setShowBox(true)
  }

  const onMouseLeave = () => {
    setShowBox(false)
  }

  const offset = showBox ? 0 : 200

  return (
    <div className="relative flex items-center">
      {links.map((link) => (
        <Link
          ref={setRefFromKey(link.name)}
          link={link}
          key={link.link}
          active={active?.name === link.name}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      ))}
      <LinkGlow
        className="bottom-0 left-0"
        style={{
          transform: `translateX(${left - offset}px) scaleX(${scaleX})`,
          opacity: +!!showBox
        }}
      />
      <LinkGlow
        className="top-0 left-0 transition origin-left ease-cool bg-gradient-to-r from-transparent via-primary-500 to-transparent"
        style={{
          transform: `translateX(${left + offset}px) scaleX(${scaleX})`,
          opacity: +!!showBox
        }}
      />
    </div>
  )
}

export const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const route = useMemo(() => {
    const key = Object.keys(routes).find((key) => {
      const route = routes[key]
      return matchPath(route.path, location.pathname)
    })

    if (!key) return null

    return routes[key]
  }, [location.pathname])

  const navigateBack = () => {
    navigate(-1)
  }

  const showBackButton = useMemo(() => {
    if (!route) return false
    return (
      route.path !== '/' &&
      route.path !== '/settings' &&
      route.path !== '/jokes' &&
      route.path !== '/guess' &&
      route.path !== '/about'
    )
  }, [route])

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between w-full h-16 max-w-screen-xl px-16 py-4 mx-auto space-x-2 bg-gray-900 backdrop-blur-md bg-opacity-60 ">
        <div className="flex items-center flex-1 space-x-14">
          <RouterLink to="/">
            <Logo />
          </RouterLink>
          <div className="flex items-center flex-1 px-2 space-x-2 border-gray-700 border-dashed border-x">
            {showBackButton && (
              <div>
                <Button size="round" color="text" onClick={navigateBack}>
                  <FiChevronLeft className="w-full h-full mr-1" />
                  <Text className="mr-2 group-hover:text-primary-500">
                    {'Back'}
                  </Text>
                </Button>
              </div>
            )}
          </div>
        </div>
        <Links />
      </div>
    </div>
  )
}
