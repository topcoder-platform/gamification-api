#!/bin/bash
set -eo pipefail
APP_NAME=$1

docker build -f Dockerfile \
  --target "${BUILDSTAGE}-build-stage" \
  -t "${APP_NAME}:latest" .
