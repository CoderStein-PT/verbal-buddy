import { useUiStore } from 'ui-store'
import { RiSunLine } from '@react-icons/all-files/ri/RiSunLine'
import { RiMoonLine } from '@react-icons/all-files/ri/RiMoonLine'
import { useEffect } from 'react'
import { useI18n } from '../../i18n'

export const ThemeToggle = () => {
  const { t } = useI18n()
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const nextMode = theme === 'dark' ? t('lightMode') : t('darkMode')
  const switchText = t('switchToMode', { mode: nextMode })

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-9 h-9 transition-all duration-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
      title={switchText}
      aria-label={switchText}
    >
      {theme === 'dark' ? (
        <RiSunLine className="w-5 h-5 text-yellow-400" />
      ) : (
        <RiMoonLine className="w-5 h-5 text-gray-700" />
      )}
    </button>
  )
}
