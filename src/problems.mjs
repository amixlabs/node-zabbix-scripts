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
  severities,
  tags
}) {
  const zbx = new Zabbix({ url, timeout })
  await zbx.login({ user, pass })
  try {
    const params = {
      selectTags: 'extend',
      value: 1,
      suppressed: false
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
    const problems = await zbx.problemGet(params)
    const triggerids = problems.map(d => d.objectid)
    const triggers = await zbx.triggerGet({
      triggerids,
      output: ['triggerid'],
      skipDependent: 1,
      monitored: 1
    })
    const enabledTriggerids = new Set(triggers.map(d => d.triggerid))
    const enabledProblems = problems.filter(d => enabledTriggerids.has(d.objectid))
    return enabledProblems
  } finally {
    await zbx.logout()
  }
}
