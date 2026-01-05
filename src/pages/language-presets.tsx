import { Text, Button, Select, Label, OptionType } from 'ui'
import { presets, languagePresets } from 'presets'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useStore } from 'store'
import { useI18n } from 'i18n'

export const LanguagePresets = () => {
  const { t } = useI18n()
  const [native, setNative] = useState(null)
  const [desired, setDesired] = useState(null)
  const [applied, setApplied] = useState(false)

  const languagePresetsOptions = languagePresets.map((preset) => ({
    value: preset.name,
    name: preset.name
  }))

  const onChangeNative = (option: OptionType) => {
    setNative(option.value)
  }

  const onChangeDesired = (option: OptionType) => {
    setDesired(option.value)
  }

  const applyLanguagePreset = () => {
    // having that languagePresets is an object with categories and words and categories and words are simple arrays like ['hello', 'world']
    // we just run through every category and word of presets[0].data and replace the words and categories of it to the ones of the languagePreset that is desired.

    const desiredPreset = languagePresets.find(
      (preset) => preset.name === desired
    )

    const nativePreset = languagePresets.find(
      (preset) => preset.name === native
    )

    if (!desiredPreset || !nativePreset) return

    const newPreset = { ...presets[1] }
    newPreset.data.categories = newPreset.data.categories.map((c, idx) => {
      return desiredPreset.data.categories[idx]
    })
    newPreset.data.words = newPreset.data.words.map((w, idx) => {
      return {
        ...w,
        text: desiredPreset.data.words[idx].text,
        definitions: [{ id: 1, text: nativePreset.data.words[idx].text }]
      }
    })

    useStore.setState((state) => ({
      ...state,
      ...newPreset.data,
      practiceStats: [],
      guessStats: [],
      selectedWords: [],
      jokes: []
    }))
    toast.success(t('presetApplied'))
    setApplied(true)
    setTimeout(() => setApplied(false), 3000)
  }

  return (
    <div className="relative flex flex-col">
      <Text variant="button">{t('languagePresets')}</Text>
      <Text className="mt-2" variant="subtitle" color="gray-light">
        {t('languagePresetsDescription')}
      </Text>
      <div className="flex items-end justify-between mt-4 space-x-2">
        <div className="flex items-center space-x-4">
          <div>
            <Label>{t('nativeLanguage')}</Label>
            <Select
              options={languagePresetsOptions}
              value={native}
              placeholder={t('language')}
              onChange={onChangeNative}
            />
          </div>
          <div>
            <Label>{t('desiredLanguage')}</Label>
            <Select
              options={languagePresetsOptions}
              value={desired}
              placeholder={t('language')}
              onChange={onChangeDesired}
            />
          </div>
        </div>
        <Button
          size="sm"
          color="grayPrimary"
          disabled={applied}
          onClick={applyLanguagePreset}
        >
          {applied ? 'Applied' : 'Apply'}
        </Button>
      </div>
    </div>
  )
}
