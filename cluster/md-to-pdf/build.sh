#!/usr/bin/env bash

timestamp="$(date "+%Y%m%d-%H%M%S")"

echo "${timestamp}" > version

docker build \
  --network host \
  --no-cache \
  --pull \
  -t "registry.b-rad.dev:443/md-to-pdf:latest" \
  -t "registry.b-rad.dev:443/md-to-pdf:${timestamp}" \
  .
