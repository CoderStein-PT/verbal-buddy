import {
  Input,
  Text,
  ListContainer,
  Row,
  ScrollableContainer,
  SeparatorFull
} from 'components'
import { useStore, PremiseType, JokeType } from 'store'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import produce from 'immer'
import { InputSendIcon } from 'components/input/input-send-icon'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { findLastId } from 'utils'

const Premise = ({
  premise,
  joke,
  index
}: {
  premise: PremiseType
  joke: JokeType
  index: number
}) => {
  const deletePremise = () => {
    useStore.setState((s) =>
      produce(s, (draft) => {
        const currentJoke = draft.jokes.find((j) => j.id === joke.id)

        if (!currentJoke?.premises) return

        currentJoke.premises = currentJoke.premises.filter(
          (p) => p.id !== premise.id
        )
      })
    )
  }

  return (
    <Row
      text={premise.text}
      index={index}
      actions={[
        {
          title: 'Delete',
          color: 'red',
          icon: RiCloseFill,
          onClick: deletePremise
        }
      ]}
    />
  )
}
export const Premises = ({ joke }: { joke: JokeType }) => {
  if (!joke.premises) return null

  return (
    <ScrollableContainer maxHeight={212}>
      <div className="px-2 divide-y divide-gray-700 divide-dashed">
        {joke.premises.map((premise, index) => (
          <Premise
            index={index + 1}
            joke={joke}
            key={premise.id}
            premise={premise}
          />
        ))}
      </div>
    </ScrollableContainer>
  )
}

export const PremisesBase = ({ joke }: { joke: JokeType }) => {
  const [text, setText] = useState('')

  const addNewPremise = () => {
    if (!text) {
      toast.error('Premise cannot be empty')
      return
    }

    if (joke.text?.includes(text)) {
      toast.error('Premise already exists')
      return
    }

    setText('')

    useStore.setState((state) =>
      produce(state, (draft) => {
        const currentJoke = draft.jokes.find((j) => j.id === joke.id)

        if (!currentJoke?.premises) return

        currentJoke.premises.push({
          id: findLastId(currentJoke.premises || []) + 1,
          text
        })
      })
    )
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return

    addNewPremise()
  }

  const onPremiseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.currentTarget.value)
  }

  return (
    <ListContainer>
      <div className="px-2">
        <Text variant="button">{'Premises'}</Text>
      </div>
      <SeparatorFull />
      <Premises joke={joke} />
      <Input
        onKeyDown={onKeyDown}
        placeholder="New premise..."
        className="w-full"
        big
        onChange={onPremiseChange}
        value={text}
        icon={
          <InputSendIcon onClick={() => onKeyDown({ key: 'Enter' } as any)} />
        }
      />
    </ListContainer>
  )
}
