import type { ReactNode } from 'react'
import Sidebar from './SideBar'

interface AppLayoutProps {
  children: ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <main className="flex min-h-screen w-screen items-center justify-center px-6 text-white bg-background">
        {children}
      </main>
    </div>
  )
}

export default AppLayout
