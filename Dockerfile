# syntax=docker/dockerfile:1

ARG NODE_IMAGE=node:24.22.2-alpine3.24@sha256:8a32c8cf649a49915a66e81e7a609223c708d0adabf288ee3f4077d765542f85

FROM ${NODE_IMAGE} AS build-stage

WORKDIR /app

COPY package.json package-lock.json ./
COPY tools ./tools
RUN npm ci --install-links=true

COPY . .
RUN npm run build

# This target is for local development only. The deploy pipeline intentionally
# uses development-build-stage, which is a minimal runtime image below.
FROM build-stage AS local-development-build-stage

ENV NODE_ENV=development

EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM ${NODE_IMAGE} AS production-dependencies-stage

WORKDIR /app

COPY package.json package-lock.json ./
COPY tools ./tools
RUN npm ci --install-links=true --omit=dev --ignore-scripts \
    && npm cache clean --force

FROM alpine:3.24@sha256:be2656061b536c1883c4034790e21d0a09c5aaaf51968b89368a3c0371ea2c9a AS runtime-stage
# Use Alpine's dynamically linked Node so apk updates the OpenSSL used at runtime.
RUN apk upgrade --no-cache \
    && apk add --no-cache 'nodejs~24' 'nodejs>=24.22.2-r0' \
        'libssl3>=3.5.10-r0' 'libcrypto3>=3.5.10-r0' 'zlib>=1.4-r0' ca-certificates icu-data-full \
    && node -e "const libs = process.report.getReport().sharedObjects; if (!['/usr/lib/libssl.so.3', '/usr/lib/libcrypto.so.3'].every(p => libs.includes(p))) process.exit(1)" \
    && addgroup -g 1000 node \
    && adduser -D -u 1000 -G node node \
    && ln -s /usr/bin/node /usr/local/bin/node
COPY --from=build-stage /usr/local/bin/docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]
WORKDIR /app
COPY --from=production-dependencies-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/dist ./dist

EXPOSE 3000
USER node
CMD ["node", "dist/server.js"]

# CircleCI deploys this target to the development ECR repository.
FROM runtime-stage AS development-build-stage
ENV NODE_ENV=development

FROM runtime-stage AS production-build-stage
ENV NODE_ENV=production
