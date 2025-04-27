#!/usr/bin/env bash

timestamp="$(date "+%Y%m%d-%H%M%S")"

echo "${timestamp}" > version

docker buildx build \
  --network host \
  --no-cache \
  --pull \
  --platform linux/amd64,linux/arm64 \
  -t "registry.b-rad.dev:443/jwt-login:latest" \
  -t "registry.b-rad.dev:443/jwt-login:${timestamp}" \
  .