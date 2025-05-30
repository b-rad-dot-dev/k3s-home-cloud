docker run \
  --rm \
  --net=host \
  -v "${HOME}/.kube:/helm/.kube" \
  -v "${HOME}/.config/helm:/helm/.config/helm" \
  -v "$(pwd):/wd" \
  --workdir /wd \
  ghcr.io/helmfile/helmfile:v0.156.0 helmfile apply
