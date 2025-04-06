"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const EnhancedBackground = dynamic(() => import("./enhanced-background"), {
  ssr: false,
  loading: () => null
})

export function BackgroundWrapper() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <EnhancedBackground />
}

// Also export as default for backward compatibility
export default BackgroundWrapper 