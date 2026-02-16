import type { ProductionData, UploadResponse } from '../types'

const API_BASE = 'http://f4040w8sskscss8c8sgc0ggc.20.102.99.51.sslip.io'
const API_KEY =
  'bc7451ed584c963e10dd2f8cf16b73730959a30a6d50989a7f40d4f8fd7a21d1'

const CLIENT_NAME = 'Farm_Zero_C'
const SECTION = 'dairyProduction'
const PERIOD = 'MONTHLY'

const DEFAULT_MAX_ATTEMPTS = 30
const DEFAULT_POLL_INTERVAL_MS = 2000

function getAuthHeaders() {
  return {
    'X-API-Key': API_KEY,
  }
}

export async function uploadPDF(file: File): Promise<string> {
  if (!file) {
    throw new Error('No file selected')
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are supported')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('client_name', CLIENT_NAME)
  formData.append('apartado', SECTION)
  formData.append('period', PERIOD)

  const response = await fetch(`${API_BASE}/process-file/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`)
  }

  const data: UploadResponse = await response.json()
  return data.session_id
}

export async function getResults(sessionId: string): Promise<ProductionData[]> {
  const response = await fetch(`${API_BASE}/results/${sessionId}/${SECTION}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Results are not ready yet. Please try again.')
  }

  const data: ProductionData[] = await response.json()
  return data
}

export async function pollResults(
  sessionId: string,
  maxAttempts: number = DEFAULT_MAX_ATTEMPTS,
  intervalMs: number = DEFAULT_POLL_INTERVAL_MS
): Promise<ProductionData[]> {
  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    try {
      const data = await getResults(sessionId)
      return data
    } catch {
      if (attempts >= maxAttempts) {
        throw new Error(
          'Processing is taking longer than expected. Please try again later.'
        )
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }

  throw new Error('Unexpected polling error')
}
