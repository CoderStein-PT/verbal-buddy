import { MdSettings } from '@react-icons/all-files/md/MdSettings'

export type LinkType = {
  name: string
  nameKey: string
  link: string
  icon?: any
  matches?: string[]
}

export const links: LinkType[] = [
  {
    name: 'Content',
    nameKey: 'content',
    link: '/',
    matches: ['/', '/category/:id', '/word/:id', '/practice/:id']
  },
  {
    name: 'Guess',
    nameKey: 'guess',
    link: '/guess',
    matches: ['/guess', '/guess/new-game', '/guess/:categoryIds']
  },
  {
    name: 'Jokes',
    nameKey: 'jokes',
    link: '/jokes',
    matches: ['/jokes', '/joke/:id', '/jokes/new']
  },
  {
    name: 'Journal',
    nameKey: 'journal',
    link: '/journal',
    matches: ['/journal', '/journal/:id']
  },
  {
    name: 'About',
    nameKey: 'about',
    link: '/about'
  },
  {
    name: 'Settings',
    nameKey: 'settings',
    link: '/settings',
    icon: MdSettings
  }
]
