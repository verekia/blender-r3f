import { useSyncExternalStore } from 'react'

const versions = new Map<string, number>()
const listeners = new Map<string, Set<() => void>>()

const getListenersForKey = (key: string) => {
  const set = listeners.get(key)
  if (set) return set
  const newSet = new Set<() => void>()
  listeners.set(key, newSet)
  return newSet
}

export const setGlbVersion = (key: string, version = Date.now()) => {
  versions.set(key, version)
  const subs = listeners.get(key)
  if (!subs) return
  subs.forEach((cb) => cb())
}

export const useGlbVersion = (key: string) => {
  const subscribe = (onStoreChange: () => void) => {
    const subs = getListenersForKey(key)
    subs.add(onStoreChange)
    return () => subs.delete(onStoreChange)
  }

  const getSnapshot = () => versions.get(key)

  return useSyncExternalStore(subscribe, getSnapshot)
}
