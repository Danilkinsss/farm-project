export function formatFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

export function formatCellValue(value: unknown, fieldName: string): string {
  if (value === null || value === undefined) {
    return '—'
  }

  if (typeof value === 'number') {
    if (Number.isNaN(value)) {
      return '—'
    }

    if (fieldName.toLowerCase().includes('percentage')) {
      return `${value.toFixed(2)}%`
    }

    return value.toLocaleString()
  }

  return String(value)
}
