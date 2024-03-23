# Zabbix Event Counter

## Usage

```sh
npm install -g amixlabs/zabbix-event-counter
zabbix-event-counter --help

# Without install
npx amixlabs/zabbix-event-counter --help
```

## Example

```sh
npx amixlabs/zabbix-event-counter \
  --url 'http://10.255.35.35/api_jsonrpc.php' \
  --user amix.reports \
  --pass '***' \
  --tags Application:Memory \
  --tags Application:Performance
```
