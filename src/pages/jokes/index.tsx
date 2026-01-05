import { Button, SeparatorFull, ProseDiv } from 'ui'
import { Row, PageContainer, ScrollableContainer } from 'components'
import { useStore, JokeType } from 'store'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { useNavigate } from 'react-router-dom'
import { JokesExplanation } from './explanation'
import { JokesExplanationEmpty } from './explanation-empty'
import { useI18n } from 'i18n'

export const Joke = ({ joke, index }: { joke: JokeType; index: number }) => {
  const words = useStore((state) => state.words)
  const jokeWords = joke?.wordIds?.map((id) => words.find((w) => w.id === id))
  const text = jokeWords?.flatMap((w) => w?.text).join(', ')
  const { t } = useI18n()

  const onDelete = () => {
    const confirmation = window.confirm(
      `${t('deleteConfirmation')} "${text}"?`
    )
    if (!confirmation) return

    useStore.setState((state) => ({
      jokes: state.jokes.filter((j) => j.id !== joke.id)
    }))
  }

  const navigate = useNavigate()

  return (
    <Row
      text={text}
      onClick={() => navigate(`/joke/${joke.id}`)}
      index={index}
      actions={[
        { title: t('delete'), icon: RiCloseFill, onClick: onDelete, color: 'red' }
      ]}
    />
  )
}

export const Jokes = () => {
  const jokes = useStore((state) => state.jokes)
  return (
    <ScrollableContainer>
      <div className="px-2">
        {jokes.map((joke, index) => (
          <Joke key={joke.id} joke={joke} index={index + 1} />
        ))}
        {jokes.length === 0 && (
          <ProseDiv>
            <JokesExplanation />
          </ProseDiv>
        )}
      </div>
    </ScrollableContainer>
  )
}

export const JokesPage = () => {
  const navigate = useNavigate()
  const words = useStore((state) => state.words)
  const categories = useStore((state) => state.categories)
  const { t } = useI18n()

  if (words.length < 3 || !categories.length)
    return (
      <PageContainer>
        <ProseDiv>
          <SeparatorFull className="my-4" />
          <JokesExplanationEmpty />
          <SeparatorFull className="my-4" />
        </ProseDiv>
      </PageContainer>
    )

  return (
    <PageContainer>
      <SeparatorFull className="my-4" />
      <Jokes />
      <SeparatorFull className="my-4" />
      <div className="flex justify-end mt-4">
        <Button onClick={() => navigate('/jokes/new')}>{t('newJoke')}</Button>
      </div>
    </PageContainer>
  )
}
