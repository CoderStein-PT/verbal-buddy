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
import { MenuLauncher } from './menu-launcher'
import { useUiStore } from 'ui-store'

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
  }, [location.pathname])

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
    <div className="relative items-center hidden md:flex">
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

const noBackButtonPaths = ['/', '/settings', '/jokes', '/guess', '/about']

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
    return !noBackButtonPaths.includes(route.path)
  }, [route])

  const openSidebar = useUiStore((state) => state.openSidebar)

  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center justify-between w-full h-12 max-w-screen-xl px-2 py-1 mx-auto bg-gray-900 md:space-x-2 md:px-16 md:py-4 md:h-16 backdrop-blur-md bg-opacity-60 ">
        <div className="absolute md:hidden top-1 left-2">
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
        <div className="flex items-center justify-center flex-1 w-full md:w-auto space-x-14">
          <RouterLink to="/">
            <Logo />
          </RouterLink>
          <MenuLauncher onClick={openSidebar} />
          <div className="items-center flex-1 hidden px-2 space-x-2 border-gray-700 border-dashed md:flex border-x">
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
