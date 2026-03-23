#!/usr/bin/env bash

echo "------------------------------------------------"
echo "INSTALLING KUBECTL"
echo "------------------------------------------------"

# -e exit immediately if something fails
# -x print command before executing it
set -ex

curl -LO https://dl.k8s.io/release/v1.32.0/bin/linux/amd64/kubectl
chmod +x kubectl
mv kubectl /usr/local/bin/