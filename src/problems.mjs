import { unixDate } from './date.mjs'
import { Zabbix } from './zabbix.mjs'

export async function getProblems({
  url,
  timeout,
  user,
  pass,
  from,
  to,
  name,
  tags
}) {
  const zbx = new Zabbix({ url, timeout })
  await zbx.login({ user, pass })
  try {
    const params = {
      selectTags: 'extend',
      value: 1
    }
    if (from) {
      const time_from = unixDate(from)
      Object.assign(params, {
        time_from
      })
    }
    if (to) {
      const time_till = unixDate(to)
      Object.assign(params, {
        time_till
      })
    }
    if (name) {
      Object.assign(params, {
        search: { name },
        searchWildcardsEnabled: 1
      })
    }
    if (tags) {
      Object.assign(params, {
        tags: tags.map((tags) => {
          const [tag, value, operator = 0] = tags.split(':')
          return { tag, value, operator }
        })
      })
    }
    const problems = await zbx.problemGet(params)
    return problems
  } finally {
    await zbx.logout()
  }
}
