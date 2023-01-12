import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import {
  Button,
  Row,
  ScrollableContainer,
  SeparatorFull,
  Text
} from 'components'
import { PageContainer } from 'components/layout/container'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { JournalEntryType, useStore } from 'store'
import { findLastId } from 'utils'
import Explanation from './explanation.mdx'
import produce from 'immer'

export const Entry = ({
  entry,
  index
}: {
  entry: JournalEntryType
  index: number
}) => {
  const onDelete = () => {
    const confirmation = window.confirm(
      `Are you sure you want to delete "${entry.title}"?`
    )
    if (!confirmation) return

    useStore.setState(
      produce((state) => {
        const entryIndex = state.journal.findIndex((j) => j.id === entry.id)
        state.journal.splice(entryIndex, 1)
      })
    )
  }

  const navigate = useNavigate()

  return (
    <Row
      text={
        <>
          <span className="mr-1 text-sm text-slate-500">
            {moment(entry.createdAt).format('DD.MM')}
          </span>
          <span>{entry.title}</span>
        </>
      }
      onClick={() => navigate(`/journal/${entry.id}`)}
      index={index}
      ellipsis
      actions={[
        { title: 'Delete', icon: RiCloseFill, onClick: onDelete, color: 'red' }
      ]}
    />
  )
}

export const Entries = () => {
  const journal = useStore((state) => state.journal)
  return (
    <ScrollableContainer>
      <div className="px-2">
        {journal.map((entry, index) => (
          <Entry key={entry.id} entry={entry} index={index + 1} />
        ))}
        {journal.length === 0 && (
          <div className="prose dark:prose-invert prose-slate">
            <Explanation />
          </div>
        )}
      </div>
    </ScrollableContainer>
  )
}

export const JournalPage = () => {
  const navigate = useNavigate()

  const createNewEntry = () => {
    const title = window.prompt('Title of the entry')
    if (!title) return

    const id = findLastId(useStore.getState().journal) + 1
    useStore.setState((state) => {
      const newEntry: JournalEntryType = {
        id,
        title,
        text: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      state.journal.push(newEntry)
      return state
    })

    navigate(`/journal/${id}`)
  }

  const clearJournal = () => {
    const confirmation = window.confirm(
      'Are you sure you want to clear journal?'
    )
    if (!confirmation) return

    useStore.setState({ journal: [] })
  }

  return (
    <PageContainer>
      <Text variant="h5">{'Journal'}</Text>
      <SeparatorFull className="my-4" />
      <Entries />
      <SeparatorFull className="my-4" />
      <div className="flex justify-between mt-4">
        <Button color="gray" size="md" onClick={clearJournal}>
          {'Clear Journal'}
        </Button>
        <Button size="md" onClick={createNewEntry}>
          {'New Entry'}
        </Button>
      </div>
    </PageContainer>
  )
}
