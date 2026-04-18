# Push script for md-to-pdf Docker image

$timestamp = Get-Content ".\version" -Raw

docker push "registry.b-rad.dev:443/md-to-pdf:latest"
docker push "registry.b-rad.dev:443/md-to-pdf:${timestamp}"
