#!/usr/bin/env bash

echo "------------------------------------------------"
echo "INSTALLING HELM"
echo "------------------------------------------------"

# -e exit immediately if something fails
# -x print command before executing it
set -ex

apt-get install curl gpg apt-transport-https --yes
curl -fsSL https://packages.buildkite.com/helm-linux/helm-debian/gpgkey | gpg --dearmor | tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/helm.gpg] https://packages.buildkite.com/helm-linux/helm-debian/any/ any main" | tee /etc/apt/sources.list.d/helm-stable-debian.list
apt-get update
apt-get install helm