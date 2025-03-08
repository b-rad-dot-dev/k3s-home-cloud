FROM ubuntu:24.04

RUN apt update && \
    apt install -y software-properties-common && \
    add-apt-repository --yes --update ppa:ansible/ansible && \
    apt install -y \
        ansible \
        curl \
        nano \
        netcat-traditional \
        sudo && \
    groupadd ansible && \
    useradd -m -g ansible -s /bin/bash ansible && \
    echo "ansible ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/ansible && \
    mkdir /home/ansible/.ssh && \
    chown -R ansible:ansible /home/ansible

USER ansible
WORKDIR /home/ansible

RUN ssh-keygen -b 4096 -t rsa -f /home/ansible/.ssh/id_rsa -q -N "" -C "ansible"

