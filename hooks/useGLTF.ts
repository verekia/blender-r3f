import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useGLTF as useDreiGLTF } from '@react-three/drei'

// Custom hook that wraps useGLTF with React Query for cache invalidation
export const useGLTF = (url: string) => {
  const [timestamp, setTimestamp] = useState(Date.now())

  // Clean URL for matching (remove leading ./)
  const cleanUrl = url.startsWith('./') ? url.slice(2) : url

  // Create a unique URL with timestamp for cache busting
  const timestampedUrl = `${url}?t=${timestamp}`

  const query = useQuery({
    queryKey: ['glb', cleanUrl, timestamp],
    queryFn: async () => {
      console.log(`📦 Loading GLTF: ${timestampedUrl}`)
      // Clear the drei cache for this URL first
      useDreiGLTF.clear(url)
      useDreiGLTF.clear(timestampedUrl)

      // Force the component to re-render by returning the timestamped URL
      return timestampedUrl
    },
    staleTime: Infinity, // Don't automatically refetch
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    // Add a refetchOnMount to ensure fresh data
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  // Use the original drei useGLTF with the result
  const gltf = useDreiGLTF(query.data || url)

  // Expose a method to trigger re-loading when called from the watcher
  const invalidate = () => {
    console.log(`🔄 Invalidating GLTF cache for: ${url}`)
    setTimestamp(Date.now())
  }

  // Store the invalidate function globally so the watcher can call it
  useEffect(() => {
    const key = `glb-invalidate-${cleanUrl}`
    ;(globalThis as any)[key] = invalidate

    return () => {
      delete (globalThis as any)[key]
    }
  }, [cleanUrl])

  return {
    ...gltf,
    isLoading: query.isLoading,
    error: query.error,
    refetch: () => {
      setTimestamp(Date.now())
      return query.refetch()
    },
  }
}

// Preload function that works with React Query
export const preloadGLTF = (url: string) => {
  return useDreiGLTF.preload(url)
}
