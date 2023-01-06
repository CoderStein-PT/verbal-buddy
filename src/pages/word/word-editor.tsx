import { Button, ListContainer, SeparatorFull, Text } from 'components'
import { useStore, WordType } from 'store'
import { Descriptions } from './description'
import { RelatedWords } from './related-words'
import { Tab } from '@headlessui/react'
import React from 'react'

const Header = ({
  breadcrumbs,
  activeBreadcrumbIndex,
  setActiveBreadcrumbIndex,
  words
}: {
  breadcrumbs: number[]
  activeBreadcrumbIndex: number
  setActiveBreadcrumbIndex: (index: number) => void
  words: WordType[]
}) => {
  return (
    <div className="px-2 overflow-x-auto">
      <Text variant="button" className="whitespace-nowrap">
        {breadcrumbs.map((breadcrumb, index) => (
          <span
            key={breadcrumb}
            className={`cursor-pointer
      ${activeBreadcrumbIndex === index && 'text-green-500'}`}
            onClick={() => setActiveBreadcrumbIndex(index)}
          >
            {index > 0 && ' - '}
            {words.find((w) => w.id === breadcrumb)?.text}
          </span>
        ))}
      </Text>
    </div>
  )
}

export const WordEditor = ({
  word,
  height,
  maxHeight
}: {
  word: WordType
  height?: number
  maxHeight?: number
}) => {
  const [breadcrumbs, setBreadcrumbs] = React.useState<number[]>([word.id])
  const [activeBreadcrumbIndex, setActiveBreadcrumbIndex] = React.useState(0)

  const onWordClick = (word: WordType) => {
    const newBreadcrumbs = [
      ...breadcrumbs.slice(0, activeBreadcrumbIndex + 1),
      word.id
    ]
    setBreadcrumbs(newBreadcrumbs)
    setActiveBreadcrumbIndex(newBreadcrumbs.length - 1)
  }

  const words = useStore((state) => state.words)

  const activeWord = words.find(
    (w) => w.id === breadcrumbs[activeBreadcrumbIndex]
  )

  if (!activeWord) return null

  return (
    <ListContainer>
      <Header
        {...{
          breadcrumbs,
          activeBreadcrumbIndex,
          setActiveBreadcrumbIndex,
          words
        }}
      />
      <Tab.Group>
        <SeparatorFull />
        <Tab.List className="flex px-2 mt-2 space-x-1">
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
            <Descriptions
              height={height}
              maxHeight={maxHeight}
              word={activeWord}
            />
          </Tab.Panel>
          <Tab.Panel>
            <RelatedWords
              height={height}
              maxHeight={maxHeight}
              onWordClick={onWordClick}
              word={activeWord}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </ListContainer>
  )
}
