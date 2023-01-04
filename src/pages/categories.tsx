import { Button, Input, Text } from 'components'
import { useStore, CategoryType } from 'store'
import { findLastId } from 'utils'
import { toast } from 'react-toastify'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { AiFillFire } from '@react-icons/all-files/ai/AiFillFire'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export const Category = ({ category }: { category: CategoryType }) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const categoryWords = useStore
    .getState()
    .words.filter((w) => w.categoryId === category.id)

  const onDelete = () => {
    useStore.setState((state) => ({
      categories: state.categories.filter((c) => c.id !== category.id)
    }))
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const onChangeCategory = () => {
    setIsEditMode(false)
    const newCategory = inputRef?.current?.value

    if (!newCategory) {
      toast.error('Category cannot be empty')
      return
    }

    if (
      useStore
        .getState()
        .categories.find((c) => c.name === newCategory && c.id !== category.id)
    ) {
      toast.error('Category already exists')
      return
    }

    useStore.setState((state) => ({
      categories: state.categories.map((c) =>
        c.id === category.id ? { ...c, name: newCategory } : c
      )
    }))
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    onChangeCategory()
  }

  return (
    <div className="flex justify-between space-x-1">
      <div className="w-full cursor-pointer group" onClick={toggleEditMode}>
        {isEditMode ? (
          <Input
            className="w-full"
            ref={inputRef}
            onBlur={onChangeCategory}
            defaultValue={category.name}
            onKeyDown={onKeyDown}
          />
        ) : (
          <Text className="group-hover:text-green-500">{category.name}</Text>
        )}
      </div>
      <Link to={`/practice/${category.id}`}>
        <Button size="icon">
          <AiFillFire className="w-full h-full" />
        </Button>
      </Link>
      <Link to={`/category/${category.id}`}>
        <Button size="icon">
          <FiEdit2 className="w-full h-full" />
        </Button>
      </Link>
      <div>
        <Button onClick={onDelete} size="icon" color="red">
          <RiCloseFill className="w-full h-full" />
        </Button>
      </div>
      <div className="w-8 ml-2 text-right">
        <Text
          className="group-hover:text-green-500"
          variant="subtitle"
          color="gray-light"
        >
          {categoryWords.length}
        </Text>
      </div>
    </div>
  )
}

export const Categories = () => {
  const categories = useStore((state) => state.categories)
  return (
    <div>
      {categories.map((category) => (
        <Category key={category.id} category={category} />
      ))}
    </div>
  )
}

export const CategoriesPage = () => {
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newCategory = event.currentTarget.value
      if (!newCategory) {
        toast.error('Category cannot be empty')
        return
      }

      if (useStore.getState().categories.find((c) => c.name === newCategory)) {
        toast.error('Category already exists')
        return
      }

      useStore.setState((state) => ({
        categories: [
          ...state.categories,
          { id: findLastId(state.categories) + 1, name: newCategory }
        ]
      }))
      event.currentTarget.value = ''
    }
  }

  return (
    <div className="mx-auto w-[400px]">
      <Categories />
      <Input
        onKeyDown={onKeyDown}
        type="text"
        placeholder="New category..."
        className="w-full mt-2"
      />
    </div>
  )
}
