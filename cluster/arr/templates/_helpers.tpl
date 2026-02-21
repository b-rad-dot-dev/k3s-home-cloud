{{- define "doplarr.name" -}}
{{- default .Chart.Name .Values.doplarr.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "doplarr.fullname" -}}
{{- if .Values.doplarr.fullnameOverride }}
{{- .Values.doplarr.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.doplarr.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "doplarr.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "doplarr.labels" -}}
helm.sh/chart: {{ include "doplarr.chart" . }}
{{ include "doplarr.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "doplarr.selectorLabels" -}}
app.kubernetes.io/name: {{ include "doplarr.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "doplarr.serviceAccountName" -}}
{{- if .Values.doplarr.serviceAccount.create }}
{{- default (include "doplarr.fullname" .) .Values.doplarr.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.doplarr.serviceAccount.name }}
{{- end }}
{{- end }}

{{/* ****************************************** */}}

{{- define "radarr.name" -}}
{{- default .Chart.Name .Values.radarr.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "radarr.fullname" -}}
{{- if .Values.radarr.fullnameOverride }}
{{- .Values.radarr.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.radarr.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "radarr.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "radarr.labels" -}}
helm.sh/chart: {{ include "radarr.chart" . }}
{{ include "radarr.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "radarr.selectorLabels" -}}
app.kubernetes.io/name: {{ include "radarr.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "radarr.serviceAccountName" -}}
{{- if .Values.radarr.serviceAccount.create }}
{{- default (include "radarr.fullname" .) .Values.radarr.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.radarr.serviceAccount.name }}
{{- end }}
{{- end }}

{{/* ****************************************** */}}

{{- define "sonarr.name" -}}
{{- default .Chart.Name .Values.sonarr.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "sonarr.fullname" -}}
{{- if .Values.sonarr.fullnameOverride }}
{{- .Values.sonarr.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.sonarr.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "sonarr.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "sonarr.labels" -}}
helm.sh/chart: {{ include "sonarr.chart" . }}
{{ include "sonarr.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "sonarr.selectorLabels" -}}
app.kubernetes.io/name: {{ include "sonarr.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "sonarr.serviceAccountName" -}}
{{- if .Values.sonarr.serviceAccount.create }}
{{- default (include "sonarr.fullname" .) .Values.sonarr.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.sonarr.serviceAccount.name }}
{{- end }}
{{- end }}

{{/* ****************************************** */}}

{{- define "arr.name" -}}
{{- default .Chart.Name .Values.arr.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "arr.fullname" -}}
{{- if .Values.arr.fullnameOverride }}
{{- .Values.arr.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.arr.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "arr.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "arr.labels" -}}
helm.sh/chart: {{ include "arr.chart" . }}
{{ include "arr.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "arr.selectorLabels" -}}
app.kubernetes.io/name: {{ include "arr.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "arr.serviceAccountName" -}}
{{- if .Values.arr.serviceAccount.create }}
{{- default (include "arr.fullname" .) .Values.arr.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.arr.serviceAccount.name }}
{{- end }}
{{- end }}