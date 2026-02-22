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

{{- define "prowlarr.name" -}}
{{- default .Chart.Name .Values.prowlarr.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "prowlarr.fullname" -}}
{{- if .Values.prowlarr.fullnameOverride }}
{{- .Values.prowlarr.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.prowlarr.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "prowlarr.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "prowlarr.labels" -}}
helm.sh/chart: {{ include "prowlarr.chart" . }}
{{ include "prowlarr.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "prowlarr.selectorLabels" -}}
app.kubernetes.io/name: {{ include "prowlarr.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "prowlarr.serviceAccountName" -}}
{{- if .Values.prowlarr.serviceAccount.create }}
{{- default (include "prowlarr.fullname" .) .Values.prowlarr.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.prowlarr.serviceAccount.name }}
{{- end }}
{{- end }}

{{/* ****************************************** */}}

{{- define "replaceme.name" -}}
{{- default .Chart.Name .Values.replaceme.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "replaceme.fullname" -}}
{{- if .Values.replaceme.fullnameOverride }}
{{- .Values.replaceme.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.replaceme.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "replaceme.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "replaceme.labels" -}}
helm.sh/chart: {{ include "replaceme.chart" . }}
{{ include "replaceme.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "replaceme.selectorLabels" -}}
app.kubernetes.io/name: {{ include "replaceme.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "replaceme.serviceAccountName" -}}
{{- if .Values.replaceme.serviceAccount.create }}
{{- default (include "replaceme.fullname" .) .Values.replaceme.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.replaceme.serviceAccount.name }}
{{- end }}
{{- end }}