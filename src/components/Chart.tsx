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
import { formatFieldName } from '../utils/format'

interface ChartProps {
  data: ProductionData[]
}

function calculateYAxisDomain(
  data: ProductionData[],
  field: string
): [number, number] {
  const values = data
    .map((row) => row[field])
    .filter(
      (v) => typeof v === 'number' && !Number.isNaN(v) && v !== null
    ) as number[]

  if (values.length === 0) {
    return [0, 100]
  }

  const min = Math.min(...values)
  const max = Math.max(...values)

  if (min === max) {
    return [min - 1, max + 1]
  }

  const range = max - min
  const padding = range * 0.1

  // Round to clean numbers to avoid floating point artifacts
  return [
    Math.floor((min - padding) * 100) / 100,
    Math.ceil((max + padding) * 100) / 100,
  ]
}

function formatTickValue(value: number): string {
  if (value >= 1000) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 0 })
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
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
                  margin={{ top: 5, right: 25, bottom: 30, left: -10 }}
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
                    width={50}
                    domain={yAxisDomain}
                    tickFormatter={formatTickValue}
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
