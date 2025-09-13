import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export const useGLBWatcher = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')

    ws.onmessage = (event) => {
      const file = event.data

      const cleanFile = file.startsWith('./') ? file.slice(2) : file
      const invalidateKey = `glb-invalidate-${cleanFile}`

      if ((globalThis as any)[invalidateKey]) {
        ;(globalThis as any)[invalidateKey]()
      }

      const fileVariations = [file, `./${file}`, `/${file}`, cleanFile]
      fileVariations.forEach((variation) => {
        const key = `glb-invalidate-${variation}`
        if ((globalThis as any)[key]) {
          ;(globalThis as any)[key]()
        }
      })

      queryClient.invalidateQueries({
        queryKey: ['glb'],
      })
    }

    return () => {
      ws.close()
    }
  }, [queryClient])

  return null
}
