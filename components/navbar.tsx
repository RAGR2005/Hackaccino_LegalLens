"use client"

import dynamic from 'next/dynamic'

// Dynamically import the client component with no SSR
const ClientNavbar = dynamic(() => import('./client-navbar'), {
  loading: () => (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="w-full h-16 animate-pulse bg-muted/10" />
      </div>
    </header>
  )
})

export default function Navbar() {
  return <ClientNavbar />
}
