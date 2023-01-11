import tw from 'tailwind-styled-components'
import { CrossButton } from './cross-button'
import { Text } from 'components'
import { useNavigate } from 'react-router-dom'
import { links, LinkType } from './links'
import { useUiStore } from 'ui-store'
import { Logo } from './logo'

const Container = tw.div<{
  $isSidebarOpen: boolean
}>`
fixed inset-0 z-50 ${({ $isSidebarOpen }) =>
  $isSidebarOpen ? '' : 'pointer-events-none'}`

const Box = tw.div<{
  $isSidebarOpen: boolean
}>`absolute w-full h-full bg-slate-900 transition duration-300 ease-in-out ${({
  $isSidebarOpen
}) => ($isSidebarOpen ? '' : '-translate-y-[700px] opacity-0 delay-100')}`

const Content = tw.div`absolute inset-0 flex flex-col space-y-3 px-8 my-16`

const MobileNavLinkContainer = tw.div<{
  $isSidebarOpen: boolean
}>`w-full py-1 transition duration-300 ease-in-out ${({ $isSidebarOpen }) =>
  $isSidebarOpen ? '' : 'translate-y-16 opacity-0'}`

const MobileNavLink = ({
  navLink,
  isSidebarOpen,
  index,
  closeSidebar
}: {
  navLink: LinkType
  index: number
  isSidebarOpen: boolean
  closeSidebar: any
}) => {
  const navigate = useNavigate()

  const onClick = () => {
    navigate(navLink.link)
    closeSidebar()
  }

  return (
    <MobileNavLinkContainer
      $isSidebarOpen={isSidebarOpen}
      onClick={onClick}
      style={{
        transitionDelay: isSidebarOpen ? (1 + index) * 30 + 'ms' : undefined
      }}
    >
      <Text variant="h6">{navLink.name}</Text>
    </MobileNavLinkContainer>
  )
}

export const Sidebar = () => {
  const isSidebarOpen = useUiStore((store) => store.isSidebarOpen)
  const closeSidebar = useUiStore((store) => store.closeSidebar)

  return (
    <Container $isSidebarOpen={isSidebarOpen}>
      <Box $isSidebarOpen={isSidebarOpen} />
      <CrossButton onClick={closeSidebar} isSidebarOpen={isSidebarOpen} />
      <div
        className={`${
          isSidebarOpen ? '' : 'opacity-0 delay-100 duration-300 ease-in-out'
        } transition w-full mt-2.5 mb-4 relative`}
      >
        <div className="flex flex-col items-center justify-center">
          <Logo />
          <div className="w-24 h-1 mt-4 border-b border-dashed border-slate-500"></div>
        </div>
      </div>
      <Content>
        {links.map((navLink, index) => (
          <MobileNavLink
            navLink={navLink}
            closeSidebar={closeSidebar}
            isSidebarOpen={isSidebarOpen}
            index={index}
            key={navLink.name}
          />
        ))}
      </Content>
    </Container>
  )
}
