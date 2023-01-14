import { Button, Text } from 'components'
import { useNavigate } from 'react-router-dom'
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft'

export const BackButton = () => {
  const navigate = useNavigate()

  const navigateBack = () => {
    navigate(-1)
  }

  return (
    <Button
      size="round"
      color="text"
      onClick={navigateBack}
      data-test="nav-back-button"
    >
      <FiChevronLeft className="w-full h-full mr-1" />
      <Text className="mr-2 group-hover:text-primary-500">{'Back'}</Text>
    </Button>
  )
}
