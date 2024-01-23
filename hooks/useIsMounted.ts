import { useEffect, useReducer } from 'react'

export function useIsMounted() {
  const [mounted, setMounted] = useReducer(() => true, false)
  useEffect(setMounted, [])
  return mounted
}
