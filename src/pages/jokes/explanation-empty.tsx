import { useI18n } from 'i18n'
import { Link } from 'react-router-dom'

export const JokesExplanationEmpty = () => {
  const { t } = useI18n()
  
  return (
    <p style={{ textAlign: 'center' }}>
      {t('createCategory')} <Link to="/">{t('content')}</Link> {t('createJokes')}
    </p>
  )
}
