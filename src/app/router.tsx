import AppLayout from '../components/layout/AppLayout'
import SessionPage from '../pages/SessionPage'
import SessionsPage from '../pages/SessionsPage'
import SettingsPage from '../pages/SettingsPage'
import StatsPage from '../pages/StatsPage'
import TimerPage from '../pages/TimerPage'
import { HashRouter, Route, Routes } from 'react-router-dom'

function AppRouter() {
  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<TimerPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/sessions/:sessionId" element={<SessionPage />} />
          <Route path="/statistics" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  )
}

export default AppRouter
