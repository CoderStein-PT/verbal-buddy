import { Row, Text } from 'components'
import { useStore, WordPropType, WordType } from 'store'
import produce from 'immer'
import { namesByKeys, PropKeyType } from './properties'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'

export const Prop = ({
  prop,
  index,
  onDelete
}: {
  prop: WordPropType
  index: number
  onDelete: () => void
}) => {
  return (
    <Row
      text={prop.text}
      index={index}
      ellipsis={false}
      actions={[
        { title: 'Delete', icon: RiCloseFill, onClick: onDelete, color: 'red' }
      ]}
    />
  )
}

export const Props = ({
  word,
  keys = 'props',
  nameByKey = namesByKeys[keys]
}: {
  word: WordType
  keys?: PropKeyType
  nameByKey?: string[]
}) => {
  const props = word[keys]

  const onDeleteOneProp = () => {
    useStore.setState((s) =>
      produce(s, (state) => {
        const wordIndex = state.words.findIndex((w) => w.id === word.id)
        const props = state.words[wordIndex][keys]
        if (!props) return

        state.words[wordIndex][keys] = props.slice(0, -1)
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
            onDelete={onDeleteOneProp}
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
