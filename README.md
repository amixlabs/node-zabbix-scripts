# Node Zabbix Scripts

## Usage

```sh
# Enable scope @amixlabs with readonly token
echo '@amixlabs:registry=https://npm.pkg.github.com' >>.npmrc
echo '//npm.pkg.github.com/:_authToken=<enter readonly token here>' >>.npmrc

# Install from GitHub npm registry
npm install -g @amixlabs/node-zabbix-scripts
zabbix-event-counter --help
zabbix-problem-counter --help

# Check if package is outdated
npm outdated

# Update package
npm update

# Without install
npx --package=@amixlabs/node-zabbix-scripts zabbix-event-counter --help
npx --package=@amixlabs/node-zabbix-scripts zabbix-problem-counter --help
```

## Example

```sh
npx --package=@amixlabs/node-zabbix-scripts zabbix-event-counter \
  --url 'http://10.255.35.35/api_jsonrpc.php' \
  --user amix.reports \
  --pass '***' \
  --tags Application:Memory \
  --tags Application:Performance
```

## Versioning and publish

```sh
# https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token
npm login --scope=@amixlabs --auth-type=legacy --registry=https://npm.pkg.github.com

# Versioning
npm version patch|minor|major

# Publish
npm publish
```
