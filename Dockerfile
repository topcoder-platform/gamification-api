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

FROM ${NODE_IMAGE} AS runtime-stage

WORKDIR /app

# Package managers are build-time tooling. Removing them from the runtime image
# eliminates their dependency tree and prevents package installation in a live
# container.
RUN apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules /opt/yarn-v* \
    && rm -f /usr/local/bin/corepack /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/yarn /usr/local/bin/yarnpkg

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
