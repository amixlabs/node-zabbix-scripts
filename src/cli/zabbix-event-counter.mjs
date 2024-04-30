#!/usr/bin/env -S node --no-warnings
import pkg from '../../package.json' assert { type: 'json' }

import { program as cmd } from 'commander'
import { getEvents } from '../events.mjs'

cmd.version(pkg.version)

cmd
  .requiredOption('--url <url>', 'zabbix API URL')
  .requiredOption('--user <user>', 'zabbix User')
  .requiredOption('--pass <pass>', 'zabbix Password')
  .option('--timeout <timeout>', 'timeout (ms)', 30000)
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
  .action(async (options) => {
    const events = await getEvents(options)
    if (options.json) {
      console.log(JSON.stringify({ events }, null, 2))
    } else {
      console.log(events.length)
    }
  })

cmd.parse(process.argv)
