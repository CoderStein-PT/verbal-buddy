import { Button, SeparatorFull } from 'ui'
import { ListContainer, UseWordEditorType } from 'components'
import { WordType } from 'store'
import { Properties, PropKeyType } from './properties'
import { Tab } from '@headlessui/react'
import React from 'react'
import { useRecursiveWordHeader } from './use-recursive-word'
import { Header } from './header'
import { UseWordNavigationType } from 'pages/word/use-word-navigation'

export const WordEditor = ({
  word,
  height,
  maxHeight,
  onDeleteClick,
  wordEditor,
  wordNav
}: {
  word: WordType
  height?: number
  maxHeight?: number
  onDeleteClick?: () => void
  wordEditor: UseWordEditorType
  wordNav?: UseWordNavigationType
}) => {
  const recursiveWord = useRecursiveWordHeader(word)

  if (!recursiveWord.activeWord) return null

  const contentProps = {
    height,
    maxHeight,
    word: recursiveWord.activeWord,
    onWordClick: recursiveWord.onWordClick,
    recursiveWord,
    wordEditor,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (wordNav?.onKeyDown(e, wordEditor, recursiveWord)) return
    }
  }

  const content: { keys: PropKeyType; name: string }[] = [
    { keys: 'definitions', name: 'Definitions' },
    { keys: 'props', name: 'Properties' },
    { keys: 'opposites', name: 'Opposites' }
  ]

  return (
    <ListContainer>
      <Header recursiveWord={recursiveWord} onDeleteClick={onDeleteClick} />
      <Tab.Group
        selectedIndex={wordEditor?.selectedIndex}
        onChange={wordEditor?.setSelectedIndex}
      >
        <SeparatorFull />
        <Tab.List
          className="flex px-2 mt-2 space-x-1 overflow-x-auto"
          data-test="word-editor-tabs"
        >
          {content.map((c) => (
            <Tab key={c.keys} as={React.Fragment}>
              {({ selected }) => (
                <Button size="sm" color={selected ? 'gray' : undefined}>
                  {c.name}
                </Button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <SeparatorFull className="my-2" />
        <Tab.Panels>
          {content.map((c) => (
            <Tab.Panel key={c.name}>
              <Properties {...contentProps} keys={c.keys} />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </ListContainer>
  )
}
