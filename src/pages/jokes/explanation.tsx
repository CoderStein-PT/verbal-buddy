import { useI18n } from 'i18n'

export const JokesExplanation = () => {
  const { t } = useI18n()
  
  return (
    <p style={{ textAlign: 'center' }}>{t('noJokesYet')}</p>
  )
}
