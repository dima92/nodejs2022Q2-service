# Home Library Service

> Let's try to create a Home Library Service! `Users` can create, read, update, delete data about `Artists`, `Tracks`
> and `Albums`, add them to `Favorites` in their own Home Library!

---

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/dima92/nodejs2022Q2-service
```

## Go to project root directory

```
cd nodejs2022Q2-service
```

## Installing NPM modules

```
npm install
```

## Change name file

```
.env.example -> .env
```
## .env

```
PORT=4000

POSTGRES_USER=postgres
POSTGRES_PASSWORD=123
POSTGRES_DB=nestjs

CRYPT_SALT=10
JWT_SECRET_KEY=secret123123
JWT_SECRET_REFRESH_KEY=secret123123
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h
LOG_LEVEL=2
FILE_MAX_SIZE=1000

DATABASE_URL="postgresql://postgres:123@postgres:5432/nestjs?schema=public&connect_timeout=300"
```

## Running application

```
npm run docker:build
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

To pass the tests, first issue the command in the docker

```
npx prisma migrate deploy
```

```
npx run test:auth
```

---

## Docker scan

For scan service

```
npm run docker:scan:app
```

For scan db

```
npm run docker:scan:db
```

---

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

---

## Used technologies:

- TypeScript
- docker
- nestjs
- swagger
- class-validator
- uuid
- dotenv
- jest
- eslint
- prettier
- node.js version: 16 LTS

---

## Authors:

_[Dmitry Tkachenko](https://github.com/dima92)_
