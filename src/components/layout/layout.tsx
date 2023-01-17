import { ToastContainer } from 'react-toastify'
import { Tooltip, TooltipProvider } from 'react-tooltip'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { Sidebar } from './sidebar'
import { Modal } from 'ui'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      <Navbar />
      <Sidebar />
      <div className="max-w-screen-xl mx-auto md:px-0">
        <div className="md:min-h-[800px] min-h-[500px] flex flex-col">
          <div className="px-4 pt-16 md:pt-32 md:px-16">{children}</div>
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
        <Modal />
      </div>
    </TooltipProvider>
  )
}
