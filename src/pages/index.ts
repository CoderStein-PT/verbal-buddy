import { CategoriesPage } from './categories'
import { CategoryPage } from './category'
import { CreateJokePage } from './create-joke'
import { JokesPage } from './jokes'
import { EditJokePage } from './edit-joke'
import { PracticePage } from './practice'
import { WordsPage } from './words'

export type IRoute = {
  name: string
  path: string
  component: React.ElementType<any>
  isPrivate?: boolean
}

export const routes: {
  [key: string]: IRoute
} = {
  words: {
    name: 'Words',
    path: '/words',
    component: WordsPage
  },
  home: {
    name: 'Home',
    path: '/',
    component: CategoriesPage
  },
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
  joke: {
    name: 'New Joke',
    path: '/jokes/new',
    component: CreateJokePage
  },
  jokes: {
    name: 'Jokes',
    path: '/jokes',
    component: JokesPage
  },
  editJoke: {
    name: 'Edit Joke',
    path: '/joke/:id',
    component: EditJokePage
  }
}
