#!/usr/bin/env bash

echo "------------------------------------------------"
echo "INSTALLING INTELLIJ"
echo "------------------------------------------------"

# -e exit immediately if something fails
# -x print command before executing it
set -ex

wget --progress=bar:force "https://download-cdn.jetbrains.com/idea/ideaIU-${INTELLIJ_VERSION}.tar.gz" -O intellij.tar.gz
mkdir -p /opt/intellij
tar -xvzf intellij.tar.gz -C /opt/intellij --strip-components=1
rm intellij.tar.gz

# Desktop icon
cat >/usr/share/applications/intellij.desktop <<EOL
[Desktop Entry]
Version=1.0
Type=Application
Name=IntelliJ IDEA Ultimate Edition
Icon=/opt/intellij/bin/idea.svg
Exec="/opt/intellij/bin/idea.sh" %f
Comment=Capable and Ergonomic IDE for JVM
Categories=Development;IDE;
Terminal=false
StartupWMClass=jetbrains-idea
StartupNotify=true
EOL
chmod +x /usr/share/applications/intellij.desktop
mkdir -p $HOME/Desktop
cp /usr/share/applications/intellij.desktop $HOME/Desktop/intellij.desktop
chmod +x $HOME/Desktop/intellij.desktop