#!/bin/bash

currentReplicas=$(kubectl -n comfyui-discord-bot get deployment comfyui-discord-bot-dev -o jsonpath='{.spec.replicas}')

if [[ "${currentReplicas}" == "1" ]]; then
  kubectl -n comfyui-discord-bot patch deployment comfyui-discord-bot-dev -p '{"spec": {"replicas": 0}}'
else
  kubectl -n comfyui-discord-bot patch deployment comfyui-discord-bot-dev -p '{"spec": {"replicas": 1}}'
fi