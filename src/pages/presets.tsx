import { Text, Button } from 'ui'
import { presets } from 'presets'
import { PresetType } from 'presets/types'
import { useStore, WordType } from 'store'
import { toast } from 'react-toastify'
import { useState, useRef } from 'react'
import { findLastId } from 'utils'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { Explanation } from './settings'
import Papa from 'papaparse'
import { useI18n } from 'i18n'

const Preset = ({
  preset,
  custom
}: {
  preset: PresetType
  custom?: boolean
}) => {
  const { t } = useI18n()
  const [applied, setApplied] = useState(false)

  const applyPreset = () => {
    useStore.setState((state) => ({
      ...state,
      ...preset.data,
      practiceStats: [],
      guessStats: [],
      selectedWords: [],
      jokes: []
    }))
    toast.success(t('presetApplied'))
    setApplied(true)
    setTimeout(() => setApplied(false), 3000)
  }

  const deletePreset = () => {
    useStore.setState((state) => ({
      settings: {
        ...state.settings,
        myPresets: state.settings.myPresets?.filter((p) => p.id !== preset.id)
      }
    }))
  }

  return (
    <div className="flex justify-between px-2 pt-2 space-x-2">
      <div>
        <Text>{preset.name}</Text>
        <Text variant="subtitle">{preset.description}</Text>
      </div>
      <div className="flex flex-col justify-end">
        <div className="flex items-center justify-center space-x-2">
          <Button
            size="sm"
            color="grayPrimary"
            key={preset.name}
            disabled={applied}
            onClick={applyPreset}
          >
            {applied ? t('applied') : t('apply')}
          </Button>
          <div>
            {custom && (
              <Button size="icon" color="red" onClick={deletePreset}>
                <RiCloseFill />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const Presets = () => {
  const { t } = useI18n()
  const myPresets = useStore((state) => state.settings.myPresets) || []
  const fileInputRef = useRef<HTMLInputElement>(null)

  const saveCurrentStateAsPreset = () => {
    //get current state from store, but only the parts that are relevant for presets
    const currentState = useStore.getState()

    const data = {
      categories: currentState.categories,
      words: currentState.words
    }

    const id = findLastId([...presets, ...myPresets]) + 1

    const name = prompt(t('enterPresetName')) || t('presetDefault') + ' ' + id
    const description = prompt(t('enterPresetDescription')) || t('myCustomPreset')

    useStore.setState((state) => ({
      settings: {
        ...state.settings,
        myPresets: [
          ...(state.settings.myPresets || []),
          { id, name, description, data }
        ]
      }
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      complete: (results) => {
        const state = useStore.getState()
        const newWords = [...state.words]
        const newCategories = [...state.categories]

        let nextWordId = findLastId(newWords) + 1
        let nextCategoryId = findLastId(newCategories) + 1
        let addedCount = 0

        results.data.forEach((row: any) => {
          // Expecting array: [word, category, definition]
          if (!Array.isArray(row) || row.length === 0) return

          const text = row[0]?.trim()
          const categoryName = row[1]?.trim()
          const definition = row[2]?.trim()

          if (!text) return

          if (newWords.find((w) => w.text.toLowerCase() === text.toLowerCase()))
            return

          let categoryId = undefined
          if (categoryName) {
            const existingCategory = newCategories.find(
              (c) => c.name.toLowerCase() === categoryName.toLowerCase()
            )
            if (existingCategory) {
              categoryId = existingCategory.id
            } else {
              categoryId = nextCategoryId++
              newCategories.push({ id: categoryId, name: categoryName })
            }
          }

          const newWord: WordType = {
            id: nextWordId++,
            text,
            categoryId,
            definitions: definition ? [{ id: 1, text: definition }] : []
          }
          newWords.push(newWord)
          addedCount++
        })

        useStore.setState({ words: newWords, categories: newCategories })
        toast.success(`${t('importedWords').replace('{{count}}', addedCount.toString())}`)
        if (fileInputRef.current) fileInputRef.current.value = ''
      },
      header: false,
      skipEmptyLines: true
    })
  }

  return (
    <div className="relative flex flex-col">
      <Text id="presets" variant="button">
        {t('presets')}
      </Text>
      <Explanation translationKey="presetsMainExplanation" />
      <div className="flex flex-col w-full space-y-2 divide-y divide-gray-500 divide-dashed">
        {presets.map((preset) => (
          <Preset preset={preset} key={preset.name} />
        ))}
        {myPresets?.map((preset) => (
          <Preset preset={preset} key={preset.name} custom />
        ))}
      </div>
      <div className="flex flex-col mt-4 space-y-2">
        <Button onClick={saveCurrentStateAsPreset}>
          {t('saveCurrentState')}
        </Button>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button onClick={() => fileInputRef.current?.click()}>
          {t('importCsv')}
        </Button>
        <Text className="text-xs text-gray-500 mt-1 text-center">
          {t('csvFormat')}
        </Text>
      </div>
    </div>
  )
}
