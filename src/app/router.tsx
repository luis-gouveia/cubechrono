import AppLayout from '../components/layout/AppLayout'
import TimerPage from '../pages/TimerPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<TimerPage />} />
          <Route path="/sessions" element={<TimerPage />} />
          <Route path="/statistics" element={<TimerPage />} />
          <Route path="/settings" element={<TimerPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default AppRouter
