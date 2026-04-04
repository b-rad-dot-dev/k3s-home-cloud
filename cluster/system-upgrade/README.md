# Updating

First run `./establishAutoUpdates.sh` to install the CRDs and the update controller in the cluster

Then create/update the `upgrade-plan.yaml` for the desired version to upgrade to. You can find the versions at:
https://github.com/k3s-io/k3s/releases?q=&expanded=true

You can also update based on a given channel, e.g. `latest` or `stable`. You can view the channels and their current
version at: https://update.k3s.io/v1-release/channels

Periodically update the `kubectl` by running one of the following commands with the appropriate version:

```shell
# LINUX
curl -LO https://dl.k8s.io/release/v1.35.0/bin/linux/amd64/kubectl; chmod +x kubectl; sudo mv kubectl /usr/bin/kubectl

#WINDOWS
curl.exe -LO "https://dl.k8s.io/release/v1.35.0/bin/windows/amd64/kubectl.exe"
```