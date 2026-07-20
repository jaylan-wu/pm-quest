import type { ReactElement } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import { TestSessionProvider } from '../features/personality-test/TestSessionProvider'
import { AdventurePage } from '../pages/AdventurePage'
import { LandingPage } from '../pages/LandingPage'
import { ResultPage } from '../pages/ResultPage'

export function AppRoutes(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/adventure" element={<AdventurePage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function App(): ReactElement {
  return (
    <BrowserRouter>
      <TestSessionProvider>
        <AppRoutes />
      </TestSessionProvider>
    </BrowserRouter>
  )
}
