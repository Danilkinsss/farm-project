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

export default function ProductionChart({ data }: ChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-2xl font-bold mb-4">Production Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="total_litres"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Total Litres"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="fat_percentage"
            stroke="#10b981"
            strokeWidth={2}
            name="Fat %"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="protein_percentage"
            stroke="#f59e0b"
            strokeWidth={2}
            name="Protein %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
