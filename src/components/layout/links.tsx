export type LinkType = {
  name: string
  link: string
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
    name: 'Settings',
    link: '/settings'
  },
  {
    name: 'About',
    link: '/about'
  }
]
