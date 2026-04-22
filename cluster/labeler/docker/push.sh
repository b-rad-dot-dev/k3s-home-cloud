#!/usr/bin/env bash

timestamp="$(cat version)"

docker push "registry.b-rad.dev:443/labeler:latest"
docker push "registry.b-rad.dev:443/labeler:${timestamp}"
