export interface ApiProductionData {
  ordinal: number
  litres: number
  fatPercentage: number
  proteinPercentage: number
  totalLactatingCows: number | null
  totalCows: number | null
  totalHeifers: number | null
  totalCalves: number | null
  totalDryCows: number | null
}

export interface ApiResponse {
  period: string
  data: ApiProductionData[]
}

export interface ProductionData {
  month: string
  total_litres: number
  fat_percentage: number
  protein_percentage: number
}

export interface Report {
  id: string
  farmName: string
  uploadDate: string
  data: ProductionData[]
  fileName: string
}

export interface UploadResponse {
  session_id: string
}
