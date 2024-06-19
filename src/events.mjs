import { unixDate } from './date.mjs'
import { Zabbix } from './zabbix.mjs'

export async function getEvents({
  url,
  timeout,
  user,
  pass,
  from,
  to,
  name,
  severities,
  tags
}) {
  const zbx = new Zabbix({ url, timeout })
  await zbx.login({ user, pass })
  try {
    const time_from = unixDate(from)
    const time_till = unixDate(to)
    const params = {
      time_from,
      time_till,
      selectTags: 'extend',
      value: 1
    }
    if (name) {
      Object.assign(params, {
        search: { name },
        searchWildcardsEnabled: 1
      })
    }
    if (severities) {
      Object.assign(params, { severities })
    }
    if (tags) {
      Object.assign(params, {
        tags: tags.map((tags) => {
          const [tag, value, operator = 0] = tags.split(':')
          return { tag, value, operator }
        })
      })
    }
    const events = await zbx.eventGet(params)
    return events
  } finally {
    await zbx.logout()
  }
}
