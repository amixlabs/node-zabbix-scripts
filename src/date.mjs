import { parseDate } from 'chrono-node'

export function unixDate(text) {
  return Math.floor(parseDate(text) / 1000)
}