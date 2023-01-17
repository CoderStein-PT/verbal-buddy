import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { routes, IRoute } from './pages'
import { Layout } from 'components'
import { useEffect } from 'react'
import { environment } from 'utils/helpers'
import { useStore } from 'store'
import { getVoices } from 'utils'
import { useVoiceStore } from 'voice-store'

const Page = ({ route }: { route: IRoute }) => {
  return <route.component />
}

const useSetupVoice = () => {
  const voice = useStore((state) => state.settings.voice)

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = getVoices()
      useVoiceStore.setState({ voices })
      const voiceURI = getVoices().find(
        (v) => v.voiceURI === (voice || 'Google US English')
      )

      if (!voiceURI) return

      useStore.setState((s) => ({
        ...s,
        settings: { ...s.settings, voice: voiceURI.voiceURI }
      }))
    }
  }, [])
}

export function App() {
  useSetupVoice()

  useEffect(() => {
    if (typeof window === 'undefined' || !window.glowCookies) return

    if (environment === 'development') return

    window.glowCookies.start('en', {
      style: 1,
      analytics: 'G-QNZ8Y0MWV2',
      // facebookPixel: '',
      policyLink: '/about#privacy',
      border: 'none',
      position: 'center',
      acceptBtnText: 'Accept',
      bannerBackground: '#345',
      bannerColor: '#eee',
      acceptBtnColor: '#eee',
      acceptBtnBackground: '#345',
      rejectBtnBackground: '#345',
      rejectBtnColor: '#eee',
      manageColor: 'white',
      manageBackground: '#345'
    })
  }, [])

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {Object.keys(routes).map((key) => (
            <Route
              path={routes[key].path}
              key={key}
              element={<Page route={routes[key]} />}
            />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
