import { matchPath, Link as RouterLink, useLocation } from 'react-router-dom'
import { routes } from 'pages'
import { useMemo } from 'react'
import { Logo } from './logo'
import tw from 'tailwind-styled-components'
import { MenuLauncher } from './menu-launcher'
import { useUiStore } from 'ui-store'
import { Links } from './links'
import { BackButton } from './back-button'
import { isMobile } from 'utils'

export const LinkGlow = tw.div`absolute w-[100px] h-0.5 left-0 transition origin-left ease-cool bg-gradient-to-r from-transparent via-primary-500 to-transparent`

const noBackButtonPaths = [
  '/',
  '/settings',
  '/jokes',
  '/guess',
  '/about',
  '/journal'
]

export const Navbar = () => {
  const location = useLocation()

  const route = useMemo(() => {
    const key = Object.keys(routes).find((key) => {
      const route = routes[key]
      return matchPath(route.path, location.pathname)
    })

    if (!key) return null

    return routes[key]
  }, [location.pathname])

  const showBackButton = useMemo(() => {
    if (!route) return false
    return !noBackButtonPaths.includes(route.path)
  }, [route])

  const openSidebar = useUiStore((state) => state.openSidebar)

  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center justify-between w-full h-12 max-w-screen-xl px-2 py-1 mx-auto bg-gray-900 md:space-x-2 md:px-16 md:py-4 md:h-16 backdrop-blur-md bg-opacity-60 ">
        <div className="absolute md:hidden top-1 left-2">
          {showBackButton && isMobile() && (
            <div>
              <BackButton />
            </div>
          )}
        </div>
        <div className="flex items-center justify-center flex-1 w-full md:w-auto space-x-14">
          <RouterLink to="/">
            <Logo />
          </RouterLink>
          <MenuLauncher onClick={openSidebar} />
          <div className="items-center flex-1 hidden px-2 space-x-2 border-gray-700 border-dashed md:flex border-x">
            {showBackButton && !isMobile() && (
              <div>
                <BackButton />
              </div>
            )}
          </div>
        </div>
        <Links />
      </div>
    </div>
  )
}
