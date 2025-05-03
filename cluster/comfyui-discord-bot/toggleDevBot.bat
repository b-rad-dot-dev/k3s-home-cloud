@echo off
setlocal

for /f %%i in ('kubectl -n comfyui-discord-bot get deployment comfyui-discord-bot-dev -o "jsonpath={.spec.replicas}"') do set currentReplicas=%%i

echo Current number of replicas: %currentReplicas%

if "%currentReplicas%"=="1" (
    echo Scaling dev discord bot down to 0
    kubectl -n comfyui-discord-bot patch deployment comfyui-discord-bot-dev -p "{\"spec\": {\"replicas\": 0}}"
) else (
    echo Scaling dev discord bot up to 1
    kubectl -n comfyui-discord-bot patch deployment comfyui-discord-bot-dev -p "{\"spec\": {\"replicas\": 1}}"
)

endlocal
