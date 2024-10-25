"use client"

import { useEffect } from "react"
import { Button } from "./ui/button"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
