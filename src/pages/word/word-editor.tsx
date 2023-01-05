import { Button, SeparatorFull, Text } from 'components'
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
    <div className="overflow-x-auto">
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

export const WordEditor = ({ word }: { word: WordType }) => {
  const [breadcrumbs, setBreadcrumbs] = React.useState<number[]>([word.id])
  const [activeBreadcrumbIndex, setActiveBreadcrumbIndex] = React.useState(0)

  const onWordClick = (word: WordType) => {
    setBreadcrumbs([...breadcrumbs, word.id])
    setActiveBreadcrumbIndex(breadcrumbs.length)
  }

  const words = useStore((state) => state.words)

  const activeWord = words.find(
    (w) => w.id === breadcrumbs[activeBreadcrumbIndex]
  )

  return (
    <div className="w-[400px] mx-auto">
      <Header
        {...{
          breadcrumbs,
          activeBreadcrumbIndex,
          setActiveBreadcrumbIndex,
          words
        }}
      />
      <Tab.Group>
        <SeparatorFull className="my-2" />
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
            <Descriptions word={activeWord} />
          </Tab.Panel>
          <Tab.Panel>
            <RelatedWords onWordClick={onWordClick} word={activeWord} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
