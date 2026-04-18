# Push script for md-to-pdf Docker image

$timestamp = Get-Content ".\version" -Raw

echo $timestamp | Out-File -FilePath ".\version" -Encoding utf8

docker push "registry.b-rad.dev:443/md-to-pdf:latest"
docker push "registry.b-rad.dev:443/md-to-pdf:${timestamp}"
