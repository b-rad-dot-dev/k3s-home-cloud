#!/usr/bin/env bash

echo "------------------------------------------------"
echo "INSTALLING PRE-REQUISITES / OS PACKAGES"
echo "------------------------------------------------"

apt-get update && \
apt-get install -y --no-install-recommends \
  gnome-terminal \
  meld \
  nano \
  wget