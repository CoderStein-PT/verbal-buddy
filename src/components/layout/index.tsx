import { Button } from 'components'
import { ToastContainer } from 'react-toastify'
import { Link as RouterLink } from 'react-router-dom'

const Link = ({ children, link }) => (
  <RouterLink to={link}>
    <Button>{children}</Button>
  </RouterLink>
)

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <div className="flex px-16 pt-4 space-x-2">
      <Link link={'/'}>{'Categories'}</Link>
      <Link link={'/joke'}>{'Write a joke'}</Link>
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
  </div>
)
