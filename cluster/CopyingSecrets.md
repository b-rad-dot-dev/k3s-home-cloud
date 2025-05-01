```shell
kubectl -n magicmirror get secret registry-credentials -o yaml | sed 's/namespace: .*/namespace: comfyui-discord-bot/' | kubectl apply -f -
```