import { parse } from 'csv-parse/browser/esm/sync'
export function isValidData(data: string): boolean {
  const records = parse(data, {
    delimiter: ',',
    relax_column_count: true,
  })
  return records.every(record => record.length === 6)
}
