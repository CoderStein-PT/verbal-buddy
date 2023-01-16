import { PageContainer } from 'components/layout/container'
import { Text } from 'ui'
import { Stats } from 'pages/practice/stats'
import { useParams } from 'react-router-dom'
import { useStore } from 'store'

export const PracticeStats = () => {
  const { id: categoryId } = useParams<{ id: string }>()

  const categories = useStore((state) => state.categories)

  if (!categoryId) return null

  const category = categories.find((c) => c.id === +categoryId)

  if (!category) return null

  return (
    <PageContainer>
      <Text variant="h6" className="mb-4 text-center">
        {'Category: ' + category.name}
      </Text>
      <Stats categoryId={+categoryId} />
    </PageContainer>
  )
}
