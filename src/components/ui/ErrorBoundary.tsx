"use client"

import { Button } from "@/components/ui/button"
import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from "react-error-boundary"

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage = 
    error instanceof Error ? error.message : 
    typeof error === 'string' ? error : 
    'An unexpected error occurred'
  
  return (
    <div className="flex flex-col items-center justify-center min-h-96 p-6 text-center bg-surface-900 border border-surface-800 rounded-2xl">
      <div className="text-4xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
      <p className="text-surface-400 mb-6 max-w-md">{errorMessage}</p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  )
}

export default function ErrorBoundary({
  children,
  onReset,
}: {
  children: React.ReactNode
  onReset?: () => void
}) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={onReset}
    >
      {children}
    </ReactErrorBoundary>
  )
}
