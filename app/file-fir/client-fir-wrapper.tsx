"use client"

import dynamic from "next/dynamic"

const FIRForm = dynamic(() => import("./fir-form"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
})

export default function ClientFIRWrapper() {
  return <FIRForm />
} 