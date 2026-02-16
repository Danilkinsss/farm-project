import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

export default function ProductionChart({ data }: ChartProps) {
  if (!data || data.length === 0) {
    return null
  }

  // Get available numeric fields dynamically
  const fields = Object.keys(data[0] || {}).filter(
    (key) => key !== 'month' && typeof data[0][key] === 'number'
  )

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
      <h3 className="text-xl md:text-2xl font-bold mb-4">Production Trends</h3>
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, bottom: 50, left: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} iconType="line" />
            {fields.slice(0, 3).map((field, idx) => (
              <Line
                key={field}
                type="monotone"
                dataKey={field}
                stroke={colors[idx]}
                strokeWidth={2}
                name={formatFieldName(field)}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
