import { ToastContainer } from 'react-toastify'
import { Tooltip, TooltipProvider } from 'react-tooltip'
import { Navbar } from './navbar'
import { SeparatorFull, Text } from 'components'
import { Logo } from './logo'

const MobileOverlay = () => {
  // when the website is loaded on mobile, we need to say that only the desktop version is supported
  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none bg-slate-900 md:hidden"
      style={{ zIndex: 100 }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Logo size="h3" />
        <div className="w-16 mt-4 mb-16">
          <SeparatorFull></SeparatorFull>
        </div>
        <Text variant="h3">Desktop version only</Text>
        <Text className="mt-4 w-72" color="gray-light">
          This website is only supported on desktop. Please visit this website
          on a desktop computer. 🔥
        </Text>
      </div>
    </div>
  )
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      <MobileOverlay />
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
