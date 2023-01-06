import { Row, ScrollableContainer } from 'components'
import { useStore, PremiseType, JokeType } from 'store'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'

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
    useStore.setState((state) => ({
      jokes: state.jokes.map((j) =>
        j.id === joke.id
          ? {
              ...j,
              premises: j.premises?.filter((p) => p.id !== premise.id)
            }
          : j
      )
    }))
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
    <ScrollableContainer maxHeight={200}>
      <div className="divide-y divide-gray-700 divide-dashed">
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
