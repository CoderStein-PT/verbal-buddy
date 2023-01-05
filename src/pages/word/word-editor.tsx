import { Button, SeparatorFull, Text } from 'components'
import { WordType } from 'store'
import { Descriptions } from './description'
import { RelatedWords } from './related-words'
import { Tab } from '@headlessui/react'
import React from 'react'

export const WordEditor = ({ word }: { word: WordType }) => {
  return (
    <div className="w-[400px] mx-auto">
      <Text variant="button">{word.text}</Text>
      <Tab.Group>
        <Tab.List className="flex space-x-1">
          <Tab as={React.Fragment}>
            {({ selected }) => (
              <Button size="sm" color={selected ? 'gray' : undefined}>
                {'Descriptions'}
              </Button>
            )}
          </Tab>
          <Tab as={React.Fragment}>
            {({ selected }) => (
              <Button size="sm" color={selected ? 'gray' : undefined}>
                {'Related Words'}
              </Button>
            )}
          </Tab>
        </Tab.List>
        <SeparatorFull className="my-2" />
        <Tab.Panels>
          <Tab.Panel>
            <Descriptions word={word} />
          </Tab.Panel>
          <Tab.Panel>
            <RelatedWords word={word} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
