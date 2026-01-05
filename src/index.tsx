import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import 'react-toastify/dist/ReactToastify.min.css'
import 'react-tooltip/dist/react-tooltip.css'
import './ext/glowCookies/glowCookies.css'
import './styles/custom.css'
import { App } from 'app'
import { I18nProvider } from './i18n'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <I18nProvider>
    <App />
  </I18nProvider>
)
