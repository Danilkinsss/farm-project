import type { ProductionData } from '../types'

interface DataTableProps {
  data: ProductionData[]
  title: string
}

export default function DataTable({ data, title }: DataTableProps) {
  const totalProduction = data.reduce((sum, row) => sum + row.total_litres, 0)
  const avgFat =
    data.reduce((sum, row) => sum + row.fat_percentage, 0) / data.length
  const avgProtein =
    data.reduce((sum, row) => sum + row.protein_percentage, 0) / data.length

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Total Production</div>
          <div className="text-2xl font-bold text-blue-600">
            {totalProduction.toLocaleString()} L
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Avg Fat %</div>
          <div className="text-2xl font-bold text-green-600">
            {avgFat.toFixed(2)}%
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Avg Protein %</div>
          <div className="text-2xl font-bold text-orange-600">
            {avgProtein.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Month</th>
              <th className="px-4 py-3 text-right font-semibold">
                Total Litres
              </th>
              <th className="px-4 py-3 text-right font-semibold">Fat %</th>
              <th className="px-4 py-3 text-right font-semibold">Protein %</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{row.month}</td>
                <td className="px-4 py-3 text-right">
                  {row.total_litres.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {row.fat_percentage.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  {row.protein_percentage.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
