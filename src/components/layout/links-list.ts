import { MdSettings } from '@react-icons/all-files/md/MdSettings'

export type LinkType = {
  name: string
  link: string
  icon?: React.ReactNode
  matches?: string[]
}

export const links = [
  {
    name: 'Content',
    link: '/',
    matches: ['/', '/category/:id', '/word/:id', '/practice/:id']
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
    name: 'Journal',
    link: '/journal',
    matches: ['/journal', '/journal/:id']
  },
  {
    name: 'About',
    link: '/about'
  },
  {
    name: 'Settings',
    link: '/settings',
    icon: MdSettings
  }
]
