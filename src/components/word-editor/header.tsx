import { Button, Text } from 'ui'
import { useStore } from 'store'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { RecursiveWordType } from './use-recursive-word'

export const Header = ({
  recursiveWord,
  onDeleteClick
}: {
  recursiveWord: RecursiveWordType
  onDeleteClick?: () => void
}) => {
  const words = useStore((state) => state.words)

  return (
    <div className="flex items-center justify-between py-1 pl-2 pr-1 space-x-2 overflow-x-auto">
      <Text variant="button" className="whitespace-nowrap">
        {recursiveWord.breadcrumbs.map((breadcrumb, index) => (
          <span
            key={breadcrumb}
            className={`cursor-pointer
      ${
        recursiveWord.activeBreadcrumbIndex === index &&
        !(index === 0 && recursiveWord.breadcrumbs.length === 1) &&
        'text-green-500'
      }`}
            onClick={() => recursiveWord.setActiveBreadcrumbIndex(index)}
          >
            {index > 0 && ' - '}
            {words.find((w) => w.id === breadcrumb)?.text}
          </span>
        ))}
      </Text>
      {!!onDeleteClick && (
        <div className="">
          <Button
            title="Delete Word"
            size="icon"
            color="red"
            onClick={onDeleteClick}
          >
            <RiCloseFill />
          </Button>
        </div>
      )}
    </div>
  )
}
