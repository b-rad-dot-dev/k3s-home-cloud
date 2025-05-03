{{/*
Expand the name of the chart.
*/}}
{{- define "comfyui-discord-bot.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "comfyui-discord-bot.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "comfyui-discord-bot.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "comfyui-discord-bot.labels" -}}
helm.sh/chart: {{ include "comfyui-discord-bot.chart" . }}
{{ include "comfyui-discord-bot.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "comfyui-discord-bot.labels-dev" -}}
helm.sh/chart: {{ include "comfyui-discord-bot.chart" . }}
{{ include "comfyui-discord-bot.selectorLabels-dev" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "comfyui-discord-bot.selectorLabels" -}}
app.kubernetes.io/name: {{ include "comfyui-discord-bot.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "comfyui-discord-bot.selectorLabels-dev" -}}
app.kubernetes.io/name: {{ include "comfyui-discord-bot.name" . }}-dev
app.kubernetes.io/instance: {{ .Release.Name }}-dev
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "comfyui-discord-bot.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "comfyui-discord-bot.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
