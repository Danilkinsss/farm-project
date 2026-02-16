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
