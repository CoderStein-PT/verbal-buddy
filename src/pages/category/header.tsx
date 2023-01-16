import { Button, SeparatorFull } from 'ui'
import { CategoryType, useStore } from 'store'
import { useNavigate } from 'react-router-dom'

export const Header = ({ category }: { category: CategoryType }) => {
  const navigate = useNavigate()

  const resetCategoryWords = () => {
    if (!window.confirm('Are you sure?')) return

    useStore.setState((s) => ({
      words: s.words.filter((w) => w.categoryId !== category.id)
    }))
  }

  const onPracticeClick = () => {
    navigate(`/practice/${category.id}`)
  }

  return (
    <>
      <SeparatorFull className="w-full my-2" />
      <div className="flex justify-between space-x-2">
        <Button size="sm" color="gray" onClick={resetCategoryWords}>
          {'Reset'}
        </Button>
        <Button size="sm" onClick={onPracticeClick}>
          {'Practice Category'}
        </Button>
      </div>
      <SeparatorFull className="w-full my-2" />
    </>
  )
}
