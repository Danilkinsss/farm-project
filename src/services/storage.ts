import type { Report } from '../types/index'

const STORAGE_KEY = 'dairy_reports'

export function saveReport(report: Report): void {
  const reports = getReports()
  reports.push(report)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
}

export function getReports(): Report[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function deleteReport(id: string): void {
  const reports = getReports().filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
}

export function getReportById(id: string): Report | undefined {
  return getReports().find((r) => r.id === id)
}
