import { useState, type ChangeEvent } from 'react'
import { uploadPDF, pollResults } from './services/api'
import type { ProductionData } from './types'

type FileInputChangeEvent = ChangeEvent<HTMLInputElement>

export default function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<ProductionData[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (event: FileInputChangeEvent) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const sessionId = await uploadPDF(file)
      const results = await pollResults(sessionId)

      setData(results)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong while processing the file.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <main className="w-full max-w-xl rounded-md bg-white p-6 shadow">
        <h1 className="mb-2 text-xl font-semibold">Milk production reports</h1>
        <p className="mb-4 text-sm text-slate-600">
          Select a PDF report to extract and review the production data.
        </p>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          disabled={isLoading}
        />

        {isLoading && (
          <p className="mt-4 text-sm text-slate-700">
            Processing file, this can take a few moments…
          </p>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {data && (
          <section className="mt-6">
            <h2 className="mb-2 text-sm font-medium text-slate-700">
              Extracted data
            </h2>
            <pre className="max-h-80 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-50">
              {JSON.stringify(data, null, 2)}
            </pre>
          </section>
        )}
      </main>
    </div>
  )
}
