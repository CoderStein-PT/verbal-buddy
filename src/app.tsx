import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { routes, IRoute } from './pages'
import { Layout } from 'components'

const Page = ({ route }: { route: IRoute }) => {
  return <route.component />
}

export function App() {
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
