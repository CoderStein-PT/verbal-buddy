import { Button, SeparatorFull, Text } from 'ui'
import { Link } from 'react-router-dom'
import { useI18n } from 'i18n'

export const Placeholder = () => {
  const { t } = useI18n()
  
  return (
    <div className="text-center">
      <div className="w-1/3 mx-auto">
        <Text variant="h4">{t('notEnoughContent')}</Text>
        <Text className="mt-4">
          {t('needAtLeastOneWord')}
        </Text>
        <SeparatorFull className="my-4" />
        <div className="flex flex-col mt-4">
          <Link to="/" className="flex flex-col w-full">
            <Button>{t('addContent')}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
