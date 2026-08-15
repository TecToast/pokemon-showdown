ARG NODE_VERSION=24.19.0
ARG PLATFORM=linux/amd64

FROM node:${NODE_VERSION} AS base
USER 1000:1000
WORKDIR /app
COPY --chown=1000:1000 package.json package-lock.json /app/
RUN npm ci --omit=dev
COPY --chown=1000:1000 . /app
RUN npm run build

FROM --platform=${PLATFORM} node:${NODE_VERSION} AS final
USER 1000:1000
WORKDIR /app
COPY --chown=1000:1000 --from=base /app/dist ./dist
COPY --chown=1000:1000 --from=base /app/config ./dist
COPY --chown=1000:1000 --from=base /app/node_modules ./node_modules
COPY --chown=1000:1000 --from=base /app/pokemon-showdown ./pokemon-showdown
ENTRYPOINT ["node", "pokemon-showdown"]
