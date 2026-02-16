import { useState } from 'react'
import { uploadPDF, pollResults } from '../services/api'
import { saveReport } from '../services/storage'

interface FileUploadProps {
  onSuccess: () => void
}

export default function FileUpload({ onSuccess }: FileUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }

    setLoading(true)
    setError(null)

    try {
      setProgress('Uploading PDF...')
      const sessionId = await uploadPDF(file)

      setProgress('Processing document (30-60 seconds)...')
      const { data, fields } = await pollResults(sessionId)

      setProgress('Saving results...')
      saveReport({
        id: crypto.randomUUID(),
        farmName: 'Farm_Zero_C',
        uploadDate: new Date().toISOString(),
        data,
        fileName: file.name,
        availableFields: fields,
      })

      setProgress('Success! ✓')
      setTimeout(() => {
        onSuccess()
        setLoading(false)
        setProgress('')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setLoading(false)
      setProgress('')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          disabled={loading}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer block ${
            loading ? 'cursor-not-allowed' : ''
          }`}
        >
          <div className="text-4xl mb-4">📄</div>
          <div className="text-lg font-medium text-gray-700 mb-2">
            {loading ? progress : 'Upload Production Report'}
          </div>
          {!loading && (
            <div className="text-sm text-gray-500">
              PDF files: production reports, lab results, delivery summaries
            </div>
          )}
        </label>

        {loading && (
          <div className="mt-6">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
