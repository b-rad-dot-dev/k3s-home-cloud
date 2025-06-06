@echo off
setlocal

if "%~1"=="" (
  echo Applying all releases...
  docker run --rm --net=host -v "%USERPROFILE%/.kube:/helm/.kube" -v "%APPDATA%/helm:/helm/.config/helm" -v "%CD%:/wd" --workdir /wd ghcr.io/helmfile/helmfile:v0.156.0 helmfile apply
) else (
  echo Applying release: %1
  docker run --rm --net=host -v "%USERPROFILE%/.kube:/helm/.kube" -v "%APPDATA%/helm:/helm/.config/helm" -v "%CD%:/wd" --workdir /wd ghcr.io/helmfile/helmfile:v0.156.0 helmfile -l name=%1 apply
)

endlocal