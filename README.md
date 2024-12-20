## 云家

## .husky

```sh
  yarn add --dev husky
  yarn husky init
```

### lintstage

```
  yarn add lint-staged -D
```

### commitlint

```sh
  echo "yarn commitlint --edit \$1" > .husky/commit-msg

  npm pkg set scripts.commitlint="commitlint --edit"
  echo "yarn commitlint \${1}" > .husky/commit-msg

  yarn add --dev @commitlint/{cli,config-conventional}

  echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

### Docker

#### nginx:alpine

```sh
  docker run --name my-nginx-server -d -p 3000:80 nginx:alpine
```

#### nginx:caddy

```sh
  docker run --name my-caddy-server -d -p 80:80 caddy:latest
```
