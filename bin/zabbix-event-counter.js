#!/usr/bin/env node
const cmd = require('commander')
const axios = require('axios').default
const chrono = require('chrono-node')

cmd.version(require('../package.json').version)

cmd
  .requiredOption('--url <url>', 'zabbix API URL')
  .requiredOption('--user <user>', 'zabbix User')
  .requiredOption('--pass <pass>', 'zabbix Password')
  .option('--from <from>', 'time from', '1 hour ago')
  .option('--to <to>', 'time to', 'now')
  .option('--name <name>', 'search wildcard event name')
  .option(
    '--tags <tags...>',
    'exact match by tag and case-insensitive search by value and operator\n' +
    'format: tag[:value[:operator]]\n' +
    'possible operator types:\n' +
    '0 - (default) Like;\n' +
    '1 - Equal;\n' +
    '2 - Not like;\n' +
    '3 - Not equal\n' +
    '4 - Exists;\n' +
    '5 - Not exists.\n'
  )
  .option('--json', 'output JSON')
  .action(async function ({ ...options }) {
    const auth = await zbxLogin(options)
    const time_from = Math.floor(chrono.parseDate(options.from) / 1000)
    const time_till = Math.floor(chrono.parseDate(options.to) / 1000)
    const params = {}
    if (options.name) {
      Object.assign(params, {
        search: { name: options.name },
        searchWildcardsEnabled: 1
      })
    }
    if (options.tags) {
      Object.assign(params, {
        tags: options.tags.map((tags) => {
          const [tag, value, operator = 0] = tags.split(':')
          return { tag, value, operator }
        })
      })
      console.log(params)
    }
    const events = await zbxEventGet(
      {
        time_from,
        time_till,
        selectTags: 'extend',
        ...params
      },
      auth,
      options
    )
    await zbxLogout(auth, options)
    if (options.json) {
      console.log(JSON.stringify({ events }, null, 2))
    } else {
      console.log(events.length)
    }
  })

cmd.parse(process.argv)

async function fetchAPI(data, { url, timeout = 30000 }) {
  const response = await axios({
    baseURL: url,
    timeout,
    headers: { 'Content-Type': 'application/json-rpc' },
    method: 'POST',
    data
  })
  const rdata = response.data
  if (rdata.error) {
    throw new Error(rdata.error.data)
  }
  return rdata.result
}

async function zbxLogin({ user, pass, ...options }) {
  return await fetchAPI(
    {
      jsonrpc: '2.0',
      method: 'user.login',
      params: { username: user, password: pass },
      id: 1
    },
    options
  )
}

async function zbxEventGet(params, auth, options) {
  return await fetchAPI(
    {
      jsonrpc: '2.0',
      method: 'event.get',
      params,
      id: 1,
      auth
    },
    options
  )
}

async function zbxLogout(auth, options) {
  return await fetchAPI(
    {
      jsonrpc: '2.0',
      method: 'user.logout',
      params: [],
      id: 1,
      auth
    },
    options
  )
}
