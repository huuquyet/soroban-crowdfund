import React from 'react'

export function useIsMounted() {
  const [mounted, setMounted] = React.useReducer(() => true, false)
  React.useEffect(setMounted, [])
  return mounted
}
