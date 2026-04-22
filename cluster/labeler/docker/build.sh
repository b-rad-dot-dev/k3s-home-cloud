#!/usr/bin/env bash

timestamp="$(date "+%Y%m%d-%H%M%S")"

echo "${timestamp}" > version

docker build \
  --network host \
  --pull \
  -t "registry.b-rad.dev:443/labeler:latest" \
  -t "registry.b-rad.dev:443/labeler:${timestamp}" \
  .
