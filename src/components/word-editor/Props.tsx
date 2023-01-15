import { ActionType, Row, Text } from 'components'
import { useStore, WordPropType, WordType } from 'store'
import produce from 'immer'
import { namesByKeys, PropKeyType } from './properties'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { BsDot } from '@react-icons/all-files/bs/BsDot'

export const Prop = ({
  prop,
  index,
  onDelete,
  words,
  onClick
}: {
  prop: WordPropType
  index: number
  onDelete: () => void
  words: WordType[]
  onClick?: (id: number) => void
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
      actions={[
        { title: 'Delete', icon: RiCloseFill, onClick: onDelete, color: 'red' },
        ...(prop.wordId
          ? [
              {
                title: 'Word',
                icon: BsDot,
                color: 'textPrimary',
                alwaysShow: true
              } as ActionType
            ]
          : [])
      ]}
    />
  )
}

export const Props = ({
  word,
  keys = 'props',
  nameByKey = namesByKeys[keys],
  onClick
}: {
  word: WordType
  keys?: PropKeyType
  nameByKey?: string[]
  onClick?: (id: number) => void
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
