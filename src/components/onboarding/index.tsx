import { useState } from 'react'
import { LanguageChooser } from './language-chooser'
import { HowItWorks } from './how-it-works'
import { useUiStore } from 'ui-store'
import { Language } from 'i18n'

export const OnboardingFlow = () => {
  const [step, setStep] = useState<'language' | 'how-it-works'>('language')
  const completeOnboarding = useUiStore((state) => state.completeOnboarding)

  const handleLanguageSelected = (language: Language) => {
    // Language is already saved in i18n context by LanguageChooser
    console.log('Selected language:', language)
    setStep('how-it-works')
  }

  const handleComplete = () => {
    completeOnboarding()
  }

  if (step === 'language') {
    return <LanguageChooser onNext={handleLanguageSelected} />
  }

  return <HowItWorks onComplete={handleComplete} />
}
