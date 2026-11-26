# syntax=docker/dockerfile:1

ARG NODE_IMAGE=node:26.13.1-alpine3.24@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5

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

FROM alpine:3.24 AS runtime-stage
RUN apk upgrade --no-cache \
    && apk add --no-cache ca-certificates 'nodejs-current~26.13.1' 'libcrypto3>=3.5.9-r1' 'libssl3>=3.5.9-r1' 'zlib>=1.4-r0' \
    && addgroup -S -g 1000 node \
    && adduser -S -D -u 1000 -G node node
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
