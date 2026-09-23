import { Toaster } from 'sonner'
import AppRouter from './router'

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="bottom-left"
        closeButton={true}
        toastOptions={{
          style: {
            background: '#e7000b',
            borderColor: '#c10007',
            color: 'white',
            maxWidth: '300px',
          },
        }}
      />
    </>
  )
}

export default App
