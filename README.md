# Node Zabbix Scripts

## Usage

```sh
npm install -g amixlabs/node-zabbix-scripts
zabbix-event-counter --help
zabbix-problem-counter --help

# Without install
npx --package=amixlabs/node-zabbix-scripts zabbix-event-counter --help
npx --package=amixlabs/node-zabbix-scripts zabbix-problem-counter --help
```

## Example

```sh
npx --package=amixlabs/node-zabbix-scripts zabbix-event-counter \
  --url 'http://10.255.35.35/api_jsonrpc.php' \
  --user amix.reports \
  --pass '***' \
  --tags Application:Memory \
  --tags Application:Performance
```
