import { Button, Text } from 'components'
import { ToastContainer } from 'react-toastify'
import {
  matchPath,
  useNavigate,
  Link as RouterLink,
  useLocation
} from 'react-router-dom'
import { routes } from 'pages'
import { useMemo } from 'react'
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft'
import { Tooltip, TooltipProvider } from 'react-tooltip'
import { GiAcorn } from '@react-icons/all-files/gi/GiAcorn'

const Link = ({ link }: { link: LinkType }) => {
  const active = useMemo(() => {
    const matches = link.matches || [link.link]
    return matches.some((match) => matchPath(match, location.pathname))
  }, [link, location.pathname])

  return (
    <RouterLink to={link.link}>
      <div className="px-2">
        <Text variant="button" color={active ? 'primary' : undefined}>
          {link.name}
        </Text>
      </div>
    </RouterLink>
  )
}

export type LinkType = {
  name: string
  link: string
  matches?: string[]
}

const links = [
  {
    name: 'Content',
    link: '/',
    matches: ['/', '/category/:id', '/word/:id']
  },
  {
    name: 'Guess',
    link: '/guess'
  },
  {
    name: 'Jokes',
    link: '/jokes',
    matches: ['/jokes', '/joke/:id', '/jokes/new']
  },
  {
    name: 'Settings',
    link: '/settings'
  },
  {
    name: 'About',
    link: '/about'
  }
]

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const navigate = useNavigate()

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
      route.path !== '/guess'
    )
  }, [route])

  return (
    <TooltipProvider>
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between px-16 pt-4 space-x-2">
          <div className="flex items-center justify-between flex-1">
            <RouterLink to="/">
              <div className="relative flex items-center space-x-2 cursor-pointer group">
                <div>
                  <GiAcorn className="transition w-7 h-7 text-primary-800 group-hover:text-primary-500" />
                </div>
                <Text
                  className="relative z-10 group-hover:text-primary-500"
                  variant="h6"
                >
                  {'Verbal Buddy'}
                </Text>
              </div>
            </RouterLink>
            <div className="flex items-center justify-end flex-1 border-r border-gray-700 border-dashed">
              <div>
                {showBackButton && (
                  <Button color="gray" onClick={navigateBack}>
                    <FiChevronLeft className="w-full h-full" />
                  </Button>
                )}
              </div>
              {route && (
                <div className="px-4">
                  <Text variant="bodyBig">{route.name}</Text>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {links.map((link) => (
              <Link link={link} key={link.link} />
            ))}
          </div>
        </div>
        <div className="px-16 pt-16">{children}</div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Tooltip className="tooltip" />
      </div>
    </TooltipProvider>
  )
}
