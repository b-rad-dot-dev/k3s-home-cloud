# Build script for md-to-pdf Docker image

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

echo $timestamp | Out-File -FilePath ".\version" -Encoding utf8

docker build `
  --network host `
  --no-cache `
  --pull `
  -t "registry.b-rad.dev:443/md-to-pdf:latest" `
  -t "registry.b-rad.dev:443/md-to-pdf:${timestamp}" `
  .
