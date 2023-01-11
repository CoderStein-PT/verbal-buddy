import tw from 'tailwind-styled-components'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'

const CrossContainer = tw.button<{
  $isSidebarOpen: boolean
}>`absolute z-20 w-10 h-10 top-1 right-1 transition duration-300 appearance-none ${({
  $isSidebarOpen
}) => ($isSidebarOpen ? 'delay-100' : 'opacity-0')}`

export const CrossButton = ({
  isSidebarOpen,
  onClick
}: {
  isSidebarOpen: boolean
  onClick: () => void
}) => (
  <CrossContainer onClick={onClick} $isSidebarOpen={isSidebarOpen}>
    <RiCloseFill className="w-full h-full text-slate-200" />
  </CrossContainer>
)
