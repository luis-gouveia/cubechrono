import AppLayout from '../components/layout/AppLayout'
import SessionPage from '../pages/SessionPage'
import SessionsPage from '../pages/SessionsPage'
import StatsPage from '../pages/StatsPage'
import TimerPage from '../pages/TimerPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<TimerPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/sessions/:sessionId" element={<SessionPage />} />
          <Route path="/statistics" element={<StatsPage />} />
          <Route path="/settings" element={<TimerPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default AppRouter
