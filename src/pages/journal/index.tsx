import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { Row, ScrollableContainer, PageContainer } from 'components'
import { Button, ProseDiv, SeparatorFull, Text } from 'ui'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { JournalEntryType, useStore } from 'store'
import { findLastId } from 'utils'
import { JournalExplanation } from './explanation'
import produce from 'immer'
import { useI18n } from 'i18n'

export const Entry = ({
  entry,
  index
}: {
  entry: JournalEntryType
  index: number
}) => {
  const { t } = useI18n()
  
  const onDelete = () => {
    const confirmation = window.confirm(
      `${t('areYouSureDeleteEntry')} "${entry.title}"?`
    )
    if (!confirmation) return

    useStore.setState(
      produce((state) => {
        const entryIndex = state.journal.findIndex(
          (j: any) => j.id === entry.id
        )
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
        { title: t('delete'), icon: RiCloseFill, onClick: onDelete, color: 'red' }
      ]}
    />
  )
}

export const Entries = () => {
  const journal = useStore((state) => state.journal)

  return (
    <ScrollableContainer>
      <div className="px-2">
        {[...journal].reverse().map((entry, index) => (
          <Entry key={entry.id} entry={entry} index={journal.length - index} />
        ))}
        {journal.length === 0 && (
          <ProseDiv>
            <JournalExplanation />
          </ProseDiv>
        )}
      </div>
    </ScrollableContainer>
  )
}

export const JournalPage = () => {
  const { t } = useI18n()
  const navigate = useNavigate()

  const createNewEntry = () => {
    const title = window.prompt(t('titleOfEntry'))
    if (!title) return

    const id = findLastId(useStore.getState().journal) + 1

    useStore.setState((s) =>
      produce(s, (state) => {
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
    )

    navigate(`/journal/${id}`)
  }

  const clearJournal = () => {
    const confirmation = window.confirm(
      t('areYouSureClearJournal')
    )
    if (!confirmation) return

    useStore.setState({ journal: [] })
  }

  return (
    <PageContainer>
      <Text variant="h5">{t('journal')}</Text>
      <SeparatorFull className="my-4" />
      <Entries />
      <SeparatorFull className="my-4" />
      <div className="flex justify-between mt-4">
        <Button color="grayPrimary" size="md" onClick={clearJournal}>
          {t('clearJournal')}
        </Button>
        <Button size="md" onClick={createNewEntry}>
          {t('newEntry')}
        </Button>
      </div>
    </PageContainer>
  )
}
