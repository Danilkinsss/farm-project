import { useState, useEffect } from 'react'
import FileUpload from './components/FileUpload'
import DataTable from './components/DataTable'
import ProductionChart from './components/Chart'
import { getReports, deleteReport } from './services/storage'
import type { Report } from './types'

function getInitialReports() {
  const allReports = getReports()
  return {
    reports: allReports,
    selected:
      allReports.length > 0 ? allReports[allReports.length - 1] : null,
  }
}

function App() {
  const initial = getInitialReports()
  const [reports, setReports] = useState<Report[]>(initial.reports)
  const [selectedReport, setSelectedReport] = useState<Report | null>(
    initial.selected
  )
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const loadReports = (selectLatest = false) => {
    const allReports = getReports()
    setReports(allReports)

    if (selectLatest && allReports.length > 0) {
      setSelectedReport(allReports[allReports.length - 1])
    }
  }

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleUploadSuccess = () => {
    loadReports(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this report?')) {
      deleteReport(id)
      setSelectedReport(null)
      loadReports(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Optimized */}
      <header className="bg-blue-600 text-white p-3 md:p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-3xl font-bold">
            🐄 Dairy Farm Tracker
          </h1>
          <p className="text-blue-100 text-xs md:text-sm mt-1">
            Production reports made simple
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-3 md:p-8">
        {/* Upload Section */}
        <div className="mb-6 md:mb-8">
          <FileUpload onSuccess={handleUploadSuccess} />
        </div>

        {/* Reports List */}
        {reports.length > 0 && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
              Saved Reports ({reports.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`bg-white rounded-lg p-3 md:p-4 cursor-pointer border-2 transition ${
                    selectedReport?.id === report.id
                      ? 'border-blue-500 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm wrap-break-word flex-1 mr-2">
                      {report.fileName}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(report.id)
                      }}
                      className="text-red-500 hover:text-red-700 text-2xl leading-none shrink-0"
                      aria-label="Delete report"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">
                    {report.farmName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(report.uploadDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    {report.data.length} months of data
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Report View */}
        {selectedReport && (
          <>
            <ProductionChart data={selectedReport.data} />
            <DataTable
              data={selectedReport.data}
              title={selectedReport.fileName}
              availableFields={
                selectedReport.availableFields ||
                Object.keys(selectedReport.data[0] || {})
              }
            />
          </>
        )}

        {/* Empty State */}
        {reports.length === 0 && (
          <div className="text-center py-8 md:py-12 text-gray-500">
            <div className="text-5xl md:text-6xl mb-4">📊</div>
            <p className="text-lg md:text-xl">No reports yet</p>
            <p className="text-xs md:text-sm mt-2">
              Upload a PDF to get started
            </p>
          </div>
        )}
      </div>

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed bottom-3 right-3 md:bottom-4 md:right-4 bg-yellow-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-lg text-sm">
          📡 Offline — saved reports still available
        </div>
      )}
    </div>
  )
}

export default App
