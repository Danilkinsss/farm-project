import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ProductionData } from '../types'

interface ChartProps {
  data: ProductionData[]
}

function formatFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

function calculateYAxisDomain(
  data: ProductionData[],
  field: string
): [number, number] {
  const values = data
    .map((row) => row[field])
    .filter((v) => typeof v === 'number' && v !== null) as number[]

  if (values.length === 0) {
    return [0, 100]
  }

  const min = Math.min(...values)
  const max = Math.max(...values)

  // If min and max are the same, add small padding
  if (min === max) {
    return [min - 1, max + 1]
  }

  // Add 10% padding on each side
  const range = max - min
  const padding = range * 0.1

  return [min - padding, max + padding]
}

export default function ProductionChart({ data }: ChartProps) {
  if (!data || data.length === 0) {
    return null
  }

  // Get available numeric fields dynamically (exclude month)
  const fields = Object.keys(data[0] || {}).filter(
    (key) => key !== 'month' && typeof data[0][key] === 'number'
  )

  if (fields.length === 0) {
    return null
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div className="space-y-6 mb-6">
      {fields.map((field, idx) => {
        const fieldName = formatFieldName(field)
        const color = colors[idx % colors.length]
        const yAxisDomain = calculateYAxisDomain(data, field)

        return (
          <div key={field} className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h4 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">
              {fieldName}
            </h4>
            <div className="h-56 md:h-72 w-full" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 25, bottom: 30, left: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-30}
                    textAnchor="end"
                    height={45}
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    width={35}
                    domain={yAxisDomain}
                    allowDataOverflow={false}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={field}
                    stroke={color}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      })}
    </div>
  )
}
