import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

export const formatAgo = (dateObj: Date) => timeAgo.format(dateObj)

export function parseDateSafe(dateStr: string | null | undefined): null | Date {
  return dateStr ? new Date(dateStr) : null
}
