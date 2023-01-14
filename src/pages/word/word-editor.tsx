import { Button, ListContainer, SeparatorFull, Text } from 'components'
import { useStore, WordType } from 'store'
import { Descriptions } from './description'
import { RelatedWords } from './related-words'
import { Tab } from '@headlessui/react'
import React, { useEffect } from 'react'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'

const Header = ({
  breadcrumbs,
  activeBreadcrumbIndex,
  setActiveBreadcrumbIndex,
  words,
  onDeleteClick
}: {
  breadcrumbs: number[]
  activeBreadcrumbIndex: number
  setActiveBreadcrumbIndex: (index: number) => void
  words: WordType[]
  onDeleteClick?: () => void
}) => {
  return (
    <div className="flex items-center justify-between py-1 pl-2 pr-1 space-x-2 overflow-x-auto">
      <Text variant="button" className="whitespace-nowrap">
        {breadcrumbs.map((breadcrumb, index) => (
          <span
            key={breadcrumb}
            className={`cursor-pointer
      ${
        activeBreadcrumbIndex === index &&
        !(index === 0 && breadcrumbs.length === 1) &&
        'text-green-500'
      }`}
            onClick={() => setActiveBreadcrumbIndex(index)}
          >
            {index > 0 && ' - '}
            {words.find((w) => w.id === breadcrumb)?.text}
          </span>
        ))}
      </Text>
      {!!onDeleteClick && (
        <div className="">
          <Button
            title="Delete Word"
            size="icon"
            color="red"
            onClick={onDeleteClick}
          >
            <RiCloseFill />
          </Button>
        </div>
      )}
    </div>
  )
}

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
  const [breadcrumbs, setBreadcrumbs] = React.useState<number[]>([word.id])
  const [activeBreadcrumbIndex, setActiveBreadcrumbIndex] = React.useState(0)

  useEffect(() => {
    setBreadcrumbs([word.id])
    setActiveBreadcrumbIndex(0)
  }, [word.id])

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
          words,
          onDeleteClick
        }}
      />
      <Tab.Group>
        <SeparatorFull />
        <Tab.List
          className="flex px-2 mt-2 space-x-1 overflow-x-auto"
          data-test="word-editor-tabs"
        >
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
          <Tab as={React.Fragment}>
            {({ selected }) => (
              <Button size="sm" color={selected ? 'gray' : undefined}>
                {'Opposites'}
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
          <Tab.Panel>
            <Descriptions
              height={height}
              maxHeight={maxHeight}
              word={activeWord}
              keys="opposites"
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </ListContainer>
  )
}
