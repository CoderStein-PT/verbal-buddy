import { Row } from 'components'
import { useStore, CategoryType } from 'store'
import { pronounce } from 'utils'
import { toast } from 'react-toastify'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { AiFillFire } from '@react-icons/all-files/ai/AiFillFire'
import { AiFillSound } from '@react-icons/all-files/ai/AiFillSound'
import { useNavigate } from 'react-router-dom'

export const Category = ({
  category,
  isSelected,
  onDelete
}: {
  category: CategoryType
  isSelected?: boolean
  onDelete: (category: CategoryType) => void
}) => {
  const navigate = useNavigate()
  const categoryWords = useStore
    .getState()
    .words.filter((w) => w.categoryId === category.id)

  const onChange = (text: string | undefined) => {
    if (!text) {
      toast.error('Category cannot be empty')
      return
    }

    const categories = useStore.getState().categories

    if (categories.find((c) => c.name === text && c.id !== category.id)) {
      toast.error('Category already exists')
      return
    }

    useStore.setState({
      categories: categories.map((c) =>
        c.id === category.id ? { ...c, name: text } : c
      )
    })
  }

  const onClick = () => {
    navigate(`/category/${category.id}`)
  }

  const onPracticeClick = () => {
    navigate(`/practice/${category.id}`)
  }

  const onDelete2 = () => {
    onDelete(category)
  }

  const onPronounce = () => {
    pronounce(category.name)
  }

  return (
    <Row
      text={category.name}
      onChange={onChange}
      onClick={onClick}
      selectedColor="primary"
      isSelected={isSelected}
      index={categoryWords.length}
      actions={[
        {
          title: 'Pronounce',
          onClick: onPronounce,
          icon: AiFillSound,
          color: 'gray'
        },
        { title: 'Practice', onClick: onPracticeClick, icon: AiFillFire },
        { title: 'Edit', onClick: 'edit', icon: FiEdit2 },
        { title: 'Delete', onClick: onDelete2, icon: RiCloseFill, color: 'red' }
      ]}
    />
  )
}
