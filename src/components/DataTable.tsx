import type { ProductionData } from '../types'

interface DataTableProps {
  data: ProductionData[]
  title: string
  availableFields?: string[]
}

function formatFieldName(field: string): string {
  // Convert camelCase to readable text
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

function getSummaryValue(data: ProductionData[], field: string): string | null {
  const values = data
    .map((row) => row[field])
    .filter((v) => typeof v === 'number') as number[]

  if (values.length === 0) {
    return null
  }

  // For percentages, show average
  if (field.toLowerCase().includes('percentage')) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    return `${avg.toFixed(2)}%`
  }

  // For other numeric fields, show total
  const total = values.reduce((a, b) => a + b, 0)
  return total.toLocaleString()
}

export default function DataTable({
  data,
  title,
  availableFields,
}: DataTableProps) {
  if (data.length === 0) {
    return null
  }

  // Use availableFields if provided, otherwise infer from first row
  const fields =
    availableFields && availableFields.length > 0
      ? availableFields
      : Object.keys(data[0])

  // Find numeric fields for summary cards (excluding month)
  const numericFields = fields.filter(
    (field) =>
      field !== 'month' &&
      typeof data[0][field] === 'number' &&
      data[0][field] !== null
  )

  const colorClasses = [
    { bg: 'bg-blue-50', text: 'text-blue-600' },
    { bg: 'bg-green-50', text: 'text-green-600' },
    { bg: 'bg-orange-50', text: 'text-orange-600' },
    { bg: 'bg-purple-50', text: 'text-purple-600' },
    { bg: 'bg-pink-50', text: 'text-pink-600' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
      <h3 className="text-xl md:text-2xl font-bold mb-4">{title}</h3>

      {/* Summary Cards */}
      {numericFields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {numericFields.slice(0, 3).map((field, idx) => {
            const summaryValue = getSummaryValue(data, field)
            const colors = colorClasses[idx % colorClasses.length]

            if (!summaryValue) {
              return null
            }

            return (
              <div key={field} className={`${colors.bg} p-4 rounded-lg`}>
                <div className="text-sm text-gray-600">
                  {formatFieldName(field)}
                </div>
                <div className={`text-2xl font-bold ${colors.text}`}>
                  {summaryValue}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Table - Mobile Optimized */}
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full text-xs md:text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {fields.map((field) => (
                    <th
                      key={field}
                      className="px-3 md:px-4 py-2 md:py-3 text-left font-semibold"
                    >
                      {formatFieldName(field)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    {fields.map((field) => {
                      const value = row[field]
                      const isNumeric = typeof value === 'number'

                      return (
                        <td
                          key={field}
                          className="px-3 md:px-4 py-2 md:py-3"
                        >
                          {isNumeric
                            ? field.toLowerCase().includes('percentage')
                              ? `${value.toFixed(2)}%`
                              : value.toLocaleString()
                            : String(value ?? '')}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
