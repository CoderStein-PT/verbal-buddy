import { Button, ListContainer, SeparatorFull } from 'components'
import { WordType } from 'store'
import { Descriptions } from './descriptions'
import { RelatedWords } from './related-words'
import { Tab } from '@headlessui/react'
import React from 'react'
import { useRecursiveWordHeader } from './use-recursive-word'
import { Header } from './header'

export const WordEditor = ({
  word,
  height,
  maxHeight,
  onDeleteClick
}: {
  word: WordType
  height?: number
  maxHeight?: number
  onDeleteClick?: () => void
}) => {
  const recursiveWord = useRecursiveWordHeader(word)

  if (!recursiveWord.activeWord) return null

  const contentProps = { height, maxHeight, word: recursiveWord.activeWord }

  const content = [
    { name: 'Descriptions', component: <Descriptions {...contentProps} /> },
    {
      name: 'Related Words',
      component: (
        <RelatedWords
          {...contentProps}
          onWordClick={recursiveWord.onWordClick}
        />
      )
    },
    {
      name: 'Opposites',
      component: <Descriptions {...contentProps} keys="opposites" />
    }
  ]

  return (
    <ListContainer>
      <Header recursiveWord={recursiveWord} onDeleteClick={onDeleteClick} />
      <Tab.Group>
        <SeparatorFull />
        <Tab.List
          className="flex px-2 mt-2 space-x-1 overflow-x-auto"
          data-test="word-editor-tabs"
        >
          {content.map((c) => (
            <Tab key={c.name} as={React.Fragment}>
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
            <Tab.Panel key={c.name}>{c.component}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </ListContainer>
  )
}
