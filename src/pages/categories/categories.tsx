import {
  ScrollableContainer,
  ScrollableContainerType,
  FloatingSelector
} from 'components'
import { ProseDiv } from 'ui'
import { useStore, CategoryType } from 'store'
import { isMobile } from 'utils'
import Explanation from './explanation.mdx'
import React from 'react'
import { Category } from './category'

export const CategoriesCore = ({
  scrollableContainer,
  onDelete
}: {
  scrollableContainer: ScrollableContainerType
  onDelete: (category: CategoryType) => void
}) => {
  const categories = useStore((state) => state.categories)

  return (
    <ScrollableContainer
      height={isMobile() ? 250 : 400}
      scrollableContainer={scrollableContainer}
    >
      <div className="px-2" data-test="categories-list">
        {categories?.length ? (
          categories.map((category) => (
            <Category
              key={category.id}
              category={category}
              onDelete={onDelete}
            />
          ))
        ) : (
          <ProseDiv>
            <Explanation />
          </ProseDiv>
        )}
      </div>
      <FloatingSelector scrollableContainer={scrollableContainer} />
    </ScrollableContainer>
  )
}

export const Categories = React.memo(CategoriesCore)
