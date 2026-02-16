// API can return ANY fields - we don't know in advance
export interface ApiProductionData {
  ordinal?: number
  [key: string]: unknown // Flexible - can have any fields
}

export interface ApiResponse {
  period?: string
  reportType?: string
  data: ApiProductionData[]
  [key: string]: unknown // Flexible metadata
}

// Our internal format - keep it flexible
export interface ProductionData {
  [key: string]: unknown // Can contain any fields from API
}

export interface Report {
  id: string
  farmName: string
  uploadDate: string
  data: ProductionData[]
  fileName: string
  reportType?: string
  availableFields: string[]
}

export interface UploadResponse {
  session_id: string
}
