# OICD open card

App for checking card status and validity for users.

## ๐ API docs

Find the API documentation [here](./docs/api/openapi.yaml) written in swagger, copy the file to [Swagger editor](https://editor.swagger.io/?_ga=2.245618116.1359773802.1671205457-100018630.1670623569).

Or run the application and visit the path `/api/v1/docs` in the browser or visi [apiDocs](http://jakubvala.co/api/v1/docs).

## ๐ Project setup

1. Install [NodeJS](https://nodejs.org/en/download/) and use the node version according to ['.nvmrc'](./.nvmrc)
2. Install npm dependencies `npm run ci`
3. Create firestore database or run app with firestore emulator

- to work with real firestore database create service account key and add it to the env vars:

```json
  ...
  "SERVICE_ACCOUNT": "...",
  ...
```

## ๐ง Configuration

To overwrite the default config, create a valid json file from `.env.json`, rewrite the default config and set the `CFG_JSON_PATH` env variable.

E.g.

```json
// This is an example of dotenv-api.json file
{
  "NODE_ENV": "development",
  "JWT_SECRET": "asdfj3lkfajs0f9jq",
  "OPEN_CARD_API_KEY": "309jasdflk23jlasdf9as0df93lsakjdf",
  "OPEN_CARD_BASE_URL": "https://opencard.com"
}
```

```bash
export CFG_JSON_PATH=~/secrets/dotenv-api.json
```

## โจ Start app

To start app, make sure that you have necessary env variables set.

1. Build the app `npm run build`
2. Start app with firestore database `npm run start` (_make sure you have set SA key in your environment_)
3. Start app with firestore emulator `npm run start:firestore:emulator`
   (_with firestore emulators stored data will be deleted after you shut down the app_)

## ๐งช Run tests

1. Install dependencies `npm run ci`
2. Build the app `npm run build`
3. Set `ENABLE_TESTS` to `true` or `1`

```bash
export ENABLE_TESTS=1
```

4. Run tests `npm run test`
