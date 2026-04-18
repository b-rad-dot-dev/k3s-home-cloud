#!/usr/bin/env bash

timestamp="$(cat version)"

echo "${timestamp}" > version

docker push "registry.b-rad.dev:443/md-to-pdf:latest"
docker push "registry.b-rad.dev:443/md-to-pdf:${timestamp}"
