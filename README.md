# k3s-home-cloud
This project aims to create a home cloud kubernetes cluster via k3s. The infrastructure is setup via ansible and
applications are deployed via helm charts. It is intended to be as simple and as straightforward as possible while also
having some amount of built-in security

---

# Layout
```
├── applications
│   └── asdf
├── infrastructure
│   └── asdf
└── prerequisites
    └── asdf
```

---

## Pre-requisites
This directory will contain everything you need to be able to create the cluster and install helm charts. To make this
as portable as possible, it'll all be done within a custom-built docker image.

### Recommended
It is recommended to have some sort of PV/PVC compatible storage backend, for example an NFS server. 

---

## Infrastructure
This directory will contain all the ansible playbooks and roles for creating the k3s master and worker nodes (if
applicable) and any dependencies they may need (opening ports in firewalls, OS dependencies, etc...)

## Applications
The following are a list of applications that will be installed:

### Base Applications
These are necessary for basic cluster management
* **MySQL** - For various application persistence
* **Infisical** - For secure k8s secrets, backed by MySQL
* **MetalLB** - Bare metal load balancer
* **cert-manager** - For handling https connections driven by certificates from LetsEncrypt

### Optional Applications
These are additional applications you may like/want and can be enabled/disabled individually
* **Docker Registry** - For hosting custom images
* **Docker Registry UI** - Simple UI to browse the docker registry
* **Emby** - Nexflix-like media server
* **Filebrowser** - Google-drive-like storage
* **Gatus** - Status page
* **Medusa** - Automatic show episode downloader
* **Ntfy** - Push notification service
* **qBittorrent** - For use w/ Medusa to manage downloads
* **ComfyUI** - Generate AI images (if cluster has GPU supported nodes)
* **Open WebUI** - ChatGPT-like AI assistant
* **Login** - Custom login interceptor (SSO-like) web-application for applications that do not support authentication
  * Requires a custom-built nginx image, not sure if it'll work w/ nginx-ingress-controller
* **Kasm** - Container-based, in-the-browser desktop environment (not sure if it'll work in k8s)
* **Homepage** - A basic, static-site home page for whatever you want
* **TriliumNext** - Knowledge base similar to confluence
* **Home Assistant** - Home Automation (best when a k8s node has a mounted zigbee/z-wave antenna)
* **Node Red** - Leverage more powerful automations for use with Home Assistant
* **phpMyAdmin** - Web interface for interacting with the MySQL server