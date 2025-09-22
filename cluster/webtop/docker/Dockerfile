FROM lscr.io/linuxserver/webtop:ubuntu-kde

ENV INTELLIJ_VERSION="2025.2.2"

COPY ./install_scripts /dockerstartup

RUN chmod +x /dockerstartup/*.sh

RUN \
    for SCRIPT in $(ls /dockerstartup | sort); do \
        bash /dockerstartup/${SCRIPT} || exit 1; \
    done

RUN rm -rf /dockerstartup