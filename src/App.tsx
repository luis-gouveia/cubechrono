import { useEffect, useState } from 'react'

function App() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTime((previousTime) => previousTime + 10)
    }, 10)

    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    const centiseconds = Math.floor((milliseconds % 1000) / 10)

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-white">
      <div className="w-full max-w-2xl text-center">
        <p className="mb-6 text-sm font-bold tracking-[0.3em] text-zinc-500">CubeChrono</p>

        <h1 className="mb-10 font-mono text-7xl font-medium tracking-tight sm:text-8xl md:text-9xl">
          {formatTime(time)}
        </h1>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setIsRunning((previous) => !previous)}
            className="w-44 rounded-xl bg-white px-6 py-4 font-bold text-zinc-950 transition hover:scale-105 active:scale-100"
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>

          <button
            onClick={() => {
              setIsRunning(false)
              setTime(0)
            }}
            className="text-sm text-zinc-500 transition hover:text-white"
          >
            Reset
          </button>
        </div>
      </div>
    </main>
  )
}

export default App
