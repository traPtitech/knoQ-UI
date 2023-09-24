import { parse } from 'csv-parse/browser/esm/sync'

export function isValidData(data: string): boolean {
  try {
    const records = parse(data, {
      delimiter: ',',
    })
    return records.every(record => record.length === 6)
  } catch (error) {
    return false
  }
}
