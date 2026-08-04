# syntax=docker/dockerfile:1

ARG NODE_IMAGE=node:24.19.0-alpine3.24@sha256:d32cdf619f63fe0471182d08996dd516c6275bb5fd31ae06e55a570bd9e1ad43

FROM ${NODE_IMAGE} AS build-stage

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

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
RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force

FROM ${NODE_IMAGE} AS runtime-stage

WORKDIR /app

# Package managers are build-time tooling. Removing them from the runtime image
# eliminates their dependency tree and prevents package installation in a live
# container.
RUN rm -rf /usr/local/lib/node_modules /opt/yarn-v* \
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
