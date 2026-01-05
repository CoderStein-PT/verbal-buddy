import { useState } from 'react'
import { Button, Text } from 'ui'
import { useI18n, languages, Language } from 'i18n'

interface LanguageChooserProps {
  onNext: (language: Language) => void
}

export const LanguageChooser = ({ onNext }: LanguageChooserProps) => {
  const { language, setLanguage, t } = useI18n()
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language)

  const handleContinue = () => {
    setLanguage(selectedLanguage)
    onNext(selectedLanguage)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-800 dark:border-gray-600 shadow-xl">
        <div className="text-center mb-8">
          <Text variant="h1">
            {t('welcome')}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-4">
            {t('languageQuestion')}
          </Text>
        </div>

        <div className="mb-8">
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as Language)}
              className="w-full px-4 py-3 text-base border-2 border-gray-800 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          className="w-full py-3 text-base font-medium"
          color="primary"
        >
          {t('continue')}
        </Button>
      </div>
    </div>
  )
}
