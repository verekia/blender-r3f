import { glbWatcherClient } from '@/lib/react-query'
import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'

const GlbWatcher = () => {
  const hasConnected = useRef(false)

  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV === 'production') return

    // Prevent double connection in React strict mode
    if (hasConnected.current) return
    hasConnected.current = true

    const ws = new WebSocket('ws://localhost:8080')

    ws.onmessage = (event) => {
      const key = `./${event.data}`
      console.log('🔄 GLB file changed:', key)
      useGLTF.clear(key)
      glbWatcherClient.resetQueries({ queryKey: [key] })
    }

    ws.onerror = (error) => console.error('WebSocket error:', error)
  }, [])

  return null
}

export default GlbWatcher
