#!/usr/bin/env bash

echo "------------------------------------------------"
echo "INSTALLING HELMFILE"
echo "------------------------------------------------"

# -e exit immediately if something fails
# -x print command before executing it
set -ex

# For Linux (amd64)
wget https://github.com/helmfile/helmfile/releases/download/v0.156.0/helmfile_0.156.0_linux_amd64.tar.gz
tar -xxf helmfile_0.156.0_linux_amd64.tar.gz
rm helmfile_0.156.0_linux_amd64.tar.gz
mv helmfile /usr/local/bin/