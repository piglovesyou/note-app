import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

export const formatDate = (() => {
  TimeAgo.addDefaultLocale(en)
  const timeAgo = new TimeAgo('en-US')
  return (dateStr: string) => timeAgo.format(new Date(dateStr))
})()
