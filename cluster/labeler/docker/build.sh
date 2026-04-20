#!/usr/bin/env bash

timestamp="$(date "+%Y%m%d-%H%M%S")"

echo "${timestamp}" > version

docker build \
  --network host \
  --pull \
  -t "registry.b-rad.dev:443/labeler:latest" \
  -t "registry.b-rad.dev:443/labeler:${timestamp}" \
  .


docker run --rm --privileged -v /dev/bus/usb:/dev/bus/usb -p 5000:5000 registry.b-rad.dev:443/labeler:latest