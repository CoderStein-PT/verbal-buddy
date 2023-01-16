import { Row, ControllableListType } from 'components'
import { Text } from 'ui'
import { useStore, WordPropType, WordType } from 'store'
import produce from 'immer'
import { namesByKeys, PropKeyType } from './properties'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { GiPlainCircle } from '@react-icons/all-files/gi/GiPlainCircle'

export const Prop = ({
  prop,
  index,
  onDelete,
  words,
  onClick,
  isSelected
}: {
  prop: WordPropType
  index: number
  onDelete: () => void
  words: WordType[]
  onClick?: (id: number) => void
  isSelected?: boolean
}) => {
  const text = prop.wordId
    ? words.find((w) => w.id === prop.id)?.text
    : prop.text

  const onRealClick = () => {
    if (!prop.wordId) return

    onClick?.(prop.wordId)
  }

  return (
    <Row
      text={text}
      index={index}
      onClick={onRealClick}
      ellipsis={false}
      selectedColor="primary"
      isSelected={isSelected}
      info={
        prop.wordId
          ? [
              {
                title: 'Word',
                icon: GiPlainCircle,
                class: 'text-green-500 shadow-primary-light-sm text-2xs px-0.5'
              }
            ]
          : undefined
      }
      actions={[
        { title: 'Delete', icon: RiCloseFill, onClick: onDelete, color: 'red' }
      ]}
    />
  )
}

export const Props = ({
  word,
  keys = 'props',
  nameByKey = namesByKeys[keys],
  onClick,
  controllableList
}: {
  word: WordType
  keys?: PropKeyType
  nameByKey?: string[]
  onClick?: (id: number) => void
  controllableList?: ControllableListType
}) => {
  const props = word[keys]
  const words = useStore((state) => state.words)

  const onDeleteOneProp = (id: number) => {
    useStore.setState((s) =>
      produce(s, (state) => {
        state.words = state.words.map((w) => {
          if (w.id === word.id) {
            w[keys] = w[keys]?.filter((p) => p.id !== id)
          }

          return w
        })
      })
    )
  }

  return (
    <div>
      {props?.length ? (
        props.map((d, index) => (
          <Prop
            key={d.id}
            prop={d}
            index={index + 1}
            onDelete={() => onDeleteOneProp(d.id)}
            words={words}
            onClick={onClick}
            isSelected={controllableList?.selectedIdx === index}
          />
        ))
      ) : (
        <Text className="text-center" variant="subtitle" color="gray-light">
          {`No ${nameByKey[0]} Yet 🧐`}
        </Text>
      )}
    </div>
  )
}
