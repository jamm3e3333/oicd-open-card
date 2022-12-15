# OICD open card

find the 📝 API documentation [here](./docs/api/openapi.yaml) written in swagger

## 👷 Project setup
1. Install [NodeJS](https://nodejs.org/en/download/)
2. Install npm dependencies `npm run ci`
3. Create firestore database or run with firestore emulators
  - to work with real firestore database create service account key and add it to the env vars:
  ```json
    ...
    "SERVICE_ACCOUNT": "...",
    ...
  ```

## 🔧 Configuration

To overwrite the default config, create a valid json file from `.env.json`, rewrite the default config and set the `CFG_JSON_PATH` env variable, e.g. `CFG_JSON_PATH=~/.env/foo.json`.

You can read more in [Configuru readme](https://github.com/AckeeCZ/configuru).

## ✨ Start app
`npm run start`
