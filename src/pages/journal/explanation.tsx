import { useI18n } from 'i18n'

export const JournalExplanation = () => {
  const { t } = useI18n()
  
  return <p>{t('noEntriesYet')}</p>
}
