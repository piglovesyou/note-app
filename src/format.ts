import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

export const formatDateObj = (dateObj: Date) => timeAgo.format(dateObj)

export const formatDateStr = (dateStr: string) =>
  formatDateObj(new Date(dateStr))
