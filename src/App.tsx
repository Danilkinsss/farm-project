import { useState, useEffect } from 'react'
import FileUpload from './components/FileUpload'
import DataTable from './components/DataTable'
import ProductionChart from './components/Chart'
import { getReports, deleteReport } from './services/storage'
import type { Report } from './types'

function App() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const loadReports = () => {
    const allReports = getReports()
    setReports(allReports)
    if (allReports.length > 0 && !selectedReport) {
      setSelectedReport(allReports[allReports.length - 1])
    }
  }

  useEffect(() => {
    // Load reports only after initial render and avoid setting state immediately in effect
    const allReports = getReports()
    setReports(allReports)
    if (allReports.length > 0 && !selectedReport) {
      setSelectedReport(allReports[allReports.length - 1])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUploadSuccess = () => {
    const allReports = getReports()
    setReports(allReports)
    if (allReports.length > 0 && !selectedReport) {
      setSelectedReport(allReports[allReports.length - 1])
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this report?')) {
      deleteReport(id)
      loadReports()
      setSelectedReport(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">🐄 Dairy Farm Tracker</h1>
          <p className="text-blue-100 text-sm mt-1">
            Production reports made simple
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Upload Section */}
        <div className="mb-8">
          <FileUpload onSuccess={handleUploadSuccess} />
        </div>

        {/* Reports List */}
        {reports.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              Saved Reports ({reports.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`bg-white rounded-lg p-4 cursor-pointer border-2 transition ${
                    selectedReport?.id === report.id
                      ? 'border-blue-500 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm">{report.fileName}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(report.id)
                      }}
                      className="text-red-500 hover:text-red-700 text-xl leading-none"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{report.farmName}</p>
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
              availableFields={selectedReport.availableFields || []}
            />
          </>
        )}

        {/* Empty State */}
        {reports.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-xl">No reports yet</p>
            <p className="text-sm mt-2">Upload a PDF to get started</p>
          </div>
        )}
      </div>

      {/* Offline Indicator */}
      {!navigator.onLine && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
          📡 Offline Mode
        </div>
      )}
    </div>
  )
}

export default App
