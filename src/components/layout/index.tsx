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

const Link = ({
  children,
  link
}: {
  children: React.ReactNode
  link: string
}) => (
  <RouterLink to={link}>
    <Button>{children}</Button>
  </RouterLink>
)

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
      <div>
        <div className="flex items-center px-16 pt-4 space-x-2">
          <Link link={'/'}>{'Content'}</Link>
          <Link link={'/jokes'}>{'Jokes'}</Link>
          <Link link={'/guess'}>{'Guess'}</Link>
          <Link link={'/settings'}>{'Settings'}</Link>
          <div>
            {showBackButton && (
              <Button color="gray" onClick={navigateBack}>
                <FiChevronLeft className="w-full h-full" />
              </Button>
            )}
          </div>
          <div>
            {route && (
              <div className="px-4 py-1">
                <Text variant="button">{route.name}</Text>
              </div>
            )}
          </div>
        </div>
        <div className="px-16 py-4">{children}</div>
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
