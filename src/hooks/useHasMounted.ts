'use client'

import { useState, useEffect } from 'react'

/** Returns true only after first client-side render.
 *  Use to guard Framer Motion opacity animations from SSR so content
 *  is always visible even before hydration completes. */
export function useHasMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  return mounted
}
