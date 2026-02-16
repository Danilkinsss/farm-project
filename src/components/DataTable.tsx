import type { ProductionData } from '../types'
import { formatFieldName, formatCellValue } from '../utils/format'

interface DataTableProps {
  data: ProductionData[]
  title: string
  availableFields?: string[]
}

function getSummaryValue(data: ProductionData[], field: string): string | null {
  const values = data
    .map((row) => row[field])
    .filter(
      (v) => typeof v === 'number' && !Number.isNaN(v)
    ) as number[]

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
    <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
          {title}
        </h3>
      </div>

      {numericFields.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-100">
          {numericFields.slice(0, 3).map((field, idx) => {
            const summaryValue = getSummaryValue(data, field)
            const colors = colorClasses[idx % colorClasses.length]

            if (!summaryValue) {
              return null
            }

            return (
              <div key={field} className="bg-white p-4 md:p-5">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {formatFieldName(field)}
                </div>
                <div className={`text-xl md:text-2xl font-bold mt-1 ${colors.text}`}>
                  {summaryValue}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              {fields.map((field) => (
                <th
                  key={field}
                  className="px-4 md:px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {formatFieldName(field)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-colors hover:bg-blue-50 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                {fields.map((field) => (
                  <td
                    key={field}
                    className="px-4 md:px-5 py-3 text-sm text-gray-700 whitespace-nowrap"
                  >
                    {formatCellValue(row[field], field)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
