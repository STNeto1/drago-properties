'use client'

export default function Error({ error }: { error: Error; reset: () => void }) {
  return (
    <div className="">
      <h1>Advertisements - Error</h1>

      {/* error message */}
      <div className="text-red-500">{error.message}</div>
    </div>
  )
}
