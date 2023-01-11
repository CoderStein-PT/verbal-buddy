import { CategoriesPage } from './categories'
import { CategoryPage } from './category'
import { CreateJokePage } from './create-joke'
import { JokesPage } from './jokes'
import { EditJokePage } from './edit-joke'
import { SettingsPage } from './settings'
import { PracticePage } from './practice'
import { WordPage } from './word'
import { GuessPage } from './guess'
import { AboutPage } from './about'
import { PracticeStats } from './practice-stats'
import { GuessStats } from './guess-stats'

export type IRoute = {
  name: string
  path: string
  component: React.ElementType<any>
  isPrivate?: boolean
}

export const routes: {
  [key: string]: IRoute
} = {
  word: { name: 'Word', path: '/word/:id', component: WordPage },
  home: { name: 'Content', path: '/', component: CategoriesPage },
  practice: {
    name: 'Practice',
    path: '/practice/:id',
    component: PracticePage
  },
  category: {
    name: 'Category',
    path: '/category/:id',
    component: CategoryPage
  },
  joke: { name: 'New Joke', path: '/jokes/new', component: CreateJokePage },
  jokes: { name: 'Jokes', path: '/jokes', component: JokesPage },
  practiceStats: {
    name: 'Practice Stats',
    path: '/practice/:id/stats',
    component: PracticeStats
  },
  guessStats: {
    name: 'Guess Stats',
    path: '/guess/stats',
    component: GuessStats
  },
  editJoke: { name: 'Edit Joke', path: '/joke/:id', component: EditJokePage },
  guess: { name: 'Guess', path: '/guess', component: GuessPage },
  settings: { name: 'Settings', path: '/settings', component: SettingsPage },
  about: { name: 'About', path: '/about', component: AboutPage }
}
