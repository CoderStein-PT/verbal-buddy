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

const Navbar = () => {
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
    <div className="fixed top-0 left-0 right-0">
      <div className="flex items-center justify-between w-full h-16 max-w-screen-xl px-16 py-4 mx-auto space-x-2 bg-gray-900 backdrop-blur-md bg-opacity-60 ">
        <div className="flex items-center flex-1 space-x-14">
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
          <div className="flex items-center flex-1 space-x-2 border-r border-gray-700 border-dashed">
            {showBackButton && (
              <div>
                <Button size="round" color="text" onClick={navigateBack}>
                  <FiChevronLeft className="w-full h-full mr-1" />
                  <Text className="mr-2 group-hover:text-primary-500">
                    Back
                  </Text>
                </Button>
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
    </div>
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
  return (
    <TooltipProvider>
      <Navbar />
      <div className="max-w-screen-xl mx-auto">
        <div className="px-16 pt-32">{children}</div>
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
