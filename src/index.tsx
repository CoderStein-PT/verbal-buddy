import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import './styles/custom.css'
import 'react-toastify/dist/ReactToastify.min.css'
import { App } from 'app'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(<App />)
