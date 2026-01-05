import { CategoriesPage } from './categories'
import { CategoryPage } from './category'
import { CreateJokePage } from './create-joke'
import { JokesPage } from './jokes'
import { EditJokePage } from './edit-joke'
import { SettingsPage } from './settings'
import { PracticePage } from './practice'
import { WordPage } from './word'
import { GuessPlayPage } from './guess-play'
import { ReverseGuessPlayPage } from './guess-play/reverse-guess'
import { GuessNewGamePage } from './guess-new-game'
import { AboutPage } from './about'
import { PracticeStats } from './practice-stats'
import { GuessStats } from './guess-stats'
import { JournalPage } from './journal'
import { JournalEditPage } from './journal-edit'

export type IRoute = {
  name: string
  nameKey: string
  path: string
  component: React.ElementType<any>
  isPrivate?: boolean
}

export const routes: {
  [key: string]: IRoute
} = {
  word: { name: 'Word', nameKey: 'word', path: '/word/:id', component: WordPage },
  home: { name: 'Content', nameKey: 'content', path: '/', component: CategoriesPage },
  practice: {
    name: 'Practice',
    nameKey: 'practice',
    path: '/practice/:id',
    component: PracticePage
  },
  category: {
    name: 'Category',
    nameKey: 'category',
    path: '/category/:id',
    component: CategoryPage
  },
  joke: { name: 'New Joke', nameKey: 'newJoke', path: '/jokes/new', component: CreateJokePage },
  jokes: { name: 'Jokes', nameKey: 'jokes', path: '/jokes', component: JokesPage },
  editJoke: { name: 'Edit Joke', nameKey: 'editJoke', path: '/joke/:id', component: EditJokePage },
  practiceStats: {
    name: 'Practice Stats',
    nameKey: 'practiceStats',
    path: '/practice/:id/stats',
    component: PracticeStats
  },
  guess: {
    name: 'Guess',
    nameKey: 'guess',
    path: '/guess',
    component: GuessStats
  },
  guessNewGame: {
    name: 'Guess',
    nameKey: 'guess',
    path: '/guess/new-game',
    component: GuessNewGamePage
  },
  guessReverse: {
    name: 'Reverse Guess',
    nameKey: 'reverseGuess',
    path: '/guess/reverse',
    component: ReverseGuessPlayPage
  },
  guessPlay: {
    name: 'Play Guess',
    nameKey: 'playGuess',
    path: '/guess/:categoryIds',
    component: GuessPlayPage
  },
  settings: { name: 'Settings', nameKey: 'settings', path: '/settings', component: SettingsPage },
  about: { name: 'About', nameKey: 'about', path: '/about', component: AboutPage },
  journal: { name: 'Journal', nameKey: 'journal', path: '/journal', component: JournalPage },
  journalEdit: {
    name: 'Edit Journal',
    nameKey: 'editJournalEntry',
    path: '/journal/:id',
    component: JournalEditPage
  }
}
