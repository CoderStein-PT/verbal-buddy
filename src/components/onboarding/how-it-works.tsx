import { Button, Text } from 'ui'
import { RiCloseLine } from '@react-icons/all-files/ri/RiCloseLine'
import { RiCheckLine } from '@react-icons/all-files/ri/RiCheckLine'
import { useI18n } from 'i18n'

interface HowItWorksProps {
  onComplete: () => void
}

export const HowItWorks = ({ onComplete }: HowItWorksProps) => {
  const { t } = useI18n()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-800 dark:border-gray-600 shadow-xl">
        <div className="text-center mb-8">
          <Text variant="h1" className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            {t('howItWorks')}
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Passive Learning */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <RiCloseLine className="w-10 h-10 text-red-600 dark:text-red-500" />
              </div>
            </div>
            <Text className="text-center font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
              {t('passiveLearning')}
            </Text>
            <Text className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('featureDescription')}
            </Text>
            <div className="space-y-2">
              {['feature1', 'feature2', 'feature3'].map((feature, idx) => (
                <div key={idx} className="flex items-center">
                  <RiCloseLine className="w-5 h-5 text-red-600 dark:text-red-500 mr-2 flex-shrink-0" />
                  <Text className="text-sm text-gray-700 dark:text-gray-300">{t(feature as any)}</Text>
                </div>
              ))}
            </div>
          </div>

          {/* Active Learning */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-primary-500 dark:border-primary-600">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <RiCheckLine className="w-10 h-10 text-primary-600 dark:text-primary-500" />
              </div>
            </div>
            <Text className="text-center font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
              {t('activeLearning')}
            </Text>
            <Text className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('featureDescription')}
            </Text>
            <div className="space-y-2">
              {['feature1', 'feature2', 'feature3'].map((feature, idx) => (
                <div key={idx} className="flex items-center">
                  <RiCheckLine className="w-5 h-5 text-primary-600 dark:text-primary-500 mr-2 flex-shrink-0" />
                  <Text className="text-sm text-gray-700 dark:text-gray-300">{t(feature as any)}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={onComplete}
          className="w-full py-3 text-base font-medium"
          color="primary"
        >
          {t('letsLearn')}
        </Button>
      </div>
    </div>
  )
}
