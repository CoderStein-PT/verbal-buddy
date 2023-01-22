import { Row, ActionType, InfoType, namesByKeys, PropKeyType } from 'components'
import { useStore, WordType } from 'store'
import { toast } from 'react-toastify'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { GiPlainCircle } from '@react-icons/all-files/gi/GiPlainCircle'
import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { useNavigate } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import { AiFillSound } from '@react-icons/all-files/ai/AiFillSound'
import { pronounce } from 'utils'

const possibleInfo: { key: PropKeyType; icon: any; class: string }[] = [
  { key: 'definitions', icon: GiPlainCircle, class: 'text-2xs px-0.5' },
  { key: 'props', icon: GiPlainCircle, class: 'text-2xs px-0.5' },
  { key: 'opposites', icon: GiPlainCircle, class: 'text-2xs px-0.5' }
]

export const Word = ({
  word,
  index,
  isSelected
}: {
  word: WordType
  index: number
  isSelected?: boolean
}) => {
  const navigate = useNavigate()

  const onChange = useCallback(
    (text: string | undefined) => {
      if (!text) {
        toast.error('Word cannot be empty')
        return
      }

      const words = useStore.getState().words

      if (words.find((w) => w.text === text && w.id !== word.id)) {
        toast.error('Word already exists')
        return
      }

      useStore.setState({
        words: words.map((w) => (w.id === word.id ? { ...w, text } : w))
      })
    },
    [word.id]
  )

  const onEditClick = useCallback(() => {
    navigate(`/word/${word.id}`)
  }, [word.id, navigate])

  const onPronounce = () => {
    pronounce(word.text)
  }

  const onDelete = () => {
    useStore.getState().deleteWord(word.id)
  }

  const actions: ActionType[] = useMemo(() => {
    return [
      {
        title: 'Pronounce',
        onClick: onPronounce,
        icon: AiFillSound,
        color: 'gray'
      },
      { title: 'Edit', icon: FiEdit2, onClick: 'edit' },
      { title: 'Delete', icon: RiCloseFill, onClick: onDelete, color: 'red' }
    ]
  }, [word])

  const infos: InfoType[] = useMemo(() => {
    return possibleInfo.map((i) => ({
      ...i,
      title:
        'Has' +
        (word[i.key]?.length ? ' ' + word[i.key]?.length : ' no') +
        ' ' +
        namesByKeys[i.key][0]?.toLowerCase(),
      class:
        i.class +
        ' ' +
        (word[i.key]?.length
          ? 'text-green-500 shadow-primary-light-sm'
          : 'text-gray-500')
    }))
  }, [word])

  return (
    <Row
      text={word.text}
      onChange={onChange}
      index={index}
      selectedColor="primary"
      onClick={onEditClick}
      actions={actions}
      isSelected={isSelected}
      info={infos}
    />
  )
}
