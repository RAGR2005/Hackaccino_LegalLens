"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Loading component
const LoadingForm = () => (
  <div className="max-w-3xl mx-auto p-6 border rounded-lg animate-pulse">
    <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
    <div className="h-4 w-96 bg-gray-200 rounded mb-8"></div>
    <div className="h-48 bg-gray-200 rounded mb-4"></div>
    <div className="h-10 w-32 bg-gray-200 rounded"></div>
  </div>
)

// Dynamic import with proper type handling
const PredictForm = dynamic(
  () => import("./predict-form").then((mod) => mod.default),
  {
    loading: () => <LoadingForm />,
    ssr: false
  }
)

export default function ClientPredictForm() {
  return (
    <Suspense fallback={<LoadingForm />}>
      <PredictForm />
    </Suspense>
  )
} 