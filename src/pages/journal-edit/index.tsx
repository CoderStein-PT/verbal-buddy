import { Button, Input, ProseDiv, Text } from 'ui'
import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import produce from 'immer'
import { JournalEntryType, useStore } from 'store'
import { toast } from 'react-toastify'
import moment from 'moment'

export const JournalEditPageCore = ({ entry }: { entry: JournalEntryType }) => {
  const [isPreview, setIsPreview] = useState(entry.text !== '')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(entry.title)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // using immer change the entry.text
    useStore.setState(
      produce((state) => {
        const entryIndex = state.journal.findIndex((j) => j.id === entry.id)
        state.journal[entryIndex].text = e.target.value
      })
    )
  }

  const turnOnEditingTitle = () => {
    setIsEditingTitle(true)
    setTimeout(() => {
      titleInputRef.current?.focus()
      titleInputRef.current?.select()
    }, 0)
  }

  const changeTitle = () => {
    if (title.trim() === '') {
      toast.error('Title cannot be empty')
      setTitle(entry.title)
      return
    }

    useStore.setState(
      produce((state) => {
        const entryIndex = state.journal.findIndex((j) => j.id === entry.id)
        state.journal[entryIndex].title = title
      })
    )
  }

  const onTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    changeTitle()

    setIsEditingTitle(false)
  }

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if it's shift + tab, remove 2 spaces
    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault()
      const target = e.target as HTMLTextAreaElement
      const start = target.selectionStart
      const end = target.selectionEnd
      const value = target.value

      // set textarea value to: text before caret + tab + text after caret
      target.value = value.substring(0, start - 2) + value.substring(end)

      // put caret at right position again
      target.selectionStart = target.selectionEnd = start - 2
      return
    }

    // if it's tab, add 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.target as HTMLTextAreaElement
      const start = target.selectionStart
      const end = target.selectionEnd
      const value = target.value

      // set textarea value to: text before caret + tab + text after caret
      target.value = value.substring(0, start) + '  ' + value.substring(end)

      // put caret at right position again
      target.selectionStart = target.selectionEnd = start + 2
    }
  }

  return (
    <div>
      <div className="flex justify-between space-x-2">
        {isEditingTitle ? (
          <div className="flex-1 w-full">
            <Input
              className="w-full"
              placeholder="Write your journal entry here..."
              value={title}
              ref={titleInputRef}
              onKeyDown={onTitleKeyDown}
              onChange={onTitleChange}
              onBlur={() => {
                changeTitle()
                setIsEditingTitle(false)
              }}
            />
          </div>
        ) : (
          <Text
            className="w-full cursor-pointer"
            variant="h5"
            onClick={turnOnEditingTitle}
          >
            {entry.title}
          </Text>
        )}
        <div className="flex items-center flex-shrink-0 space-x-2 flex-grow-1">
          <Text>{moment(entry.createdAt).format('DD.MM.YYYY | hh:mm')}</Text>
          <Button
            size="md"
            color="grayPrimary"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>
      <div className="mt-4">
        {isPreview ? (
          <ProseDiv>
            <ReactMarkdown>{entry.text}</ReactMarkdown>
          </ProseDiv>
        ) : (
          <Input
            className="w-full text-lg resize-none"
            style={{ padding: '1rem', height: '400px' }}
            placeholder="Write your journal entry here..."
            value={entry.text}
            $as={'textarea' as any}
            onKeyDown={onKeyDown}
            onChange={onChange as any}
            autoFocus
          />
        )}
      </div>
    </div>
  )
}

export const JournalEditPage = () => {
  const entryId = useParams<{ id: string }>().id || -1

  const entry = useStore((state) =>
    state.journal.find((j) => j.id === +entryId)
  )

  if (!entry) return null

  return <JournalEditPageCore entry={entry} />
}
