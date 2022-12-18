# BUILDER IMAGE
FROM node:16.18.1-buster-slim AS builder
WORKDIR /usr
COPY package*.json ./
COPY tsconfig.json ./
COPY docs/api/generated/openapi.json ./docs/api/generated/openapi.json
COPY docs/api/openapi.yaml ./docs/api/openapi.yaml
COPY .env.json ./
COPY src ./src
RUN npm ci
RUN npm run build

# MAIN IMAGE
FROM node:16.18.1-buster-slim

ENV NODE_PATH=dist
ENV NODE_ENV=${NODE_ENV}
ENV LOGGER_PRETTY=false
ENV JWT_SECRET=${JWT_SECRET}
ENV SERVICE_ACCOUNT=${SERVICE_ACCOUNT}
ENV ENABLE_TESTS=false
ENV IS_FIRESTORE_EMULATOR_USE=false
ENV OPEN_CARD_API_KEY=${OPEN_CARD_API_KEY}
ENV OPEN_CARD_BASE_URL=${OPEN_CARD_BASE_URL}

WORKDIR /usr
COPY --from=builder /usr/dist /usr/dist
COPY --from=builder /usr/src /usr/src
COPY --from=builder /usr/package*.json /usr/
COPY --from=builder /usr/.env.json /usr/
COPY --from=builder /usr/docs/api/generated/openapi.json /usr/docs/api/generated/openapi.json
COPY --from=builder /usr/docs/api/openapi.yaml /usr/docs/api/openapi.yaml
RUN npm ci --omit=dev
EXPOSE 3000
USER node
CMD [ "node", "-r", "source-map-support/register", "./dist/index.js"]
