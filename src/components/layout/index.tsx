import { ToastContainer } from 'react-toastify'
import { Tooltip, TooltipProvider } from 'react-tooltip'
import { Navbar } from './navbar'
import { Footer } from './footer'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      <Navbar />
      <div className="max-w-screen-xl mx-auto">
        <div className="min-h-[800px] flex flex-col">
          <div className="px-16 pt-32">{children}</div>
          <Footer />
        </div>
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
