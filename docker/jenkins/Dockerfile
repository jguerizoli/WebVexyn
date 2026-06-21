# Jenkins LTS + Docker CLI (sem daemon) para acionar `docker compose` no host.
# O acesso ao /var/run/docker.sock do host é feito pelo grupo `hostdocker`,
# criado com o MESMO GID do grupo `docker` do host (passado via ARG DOCKER_GID).
FROM jenkins/jenkins:lts-jdk17

USER root

# GID do grupo `docker` do host (ver docker/.env -> DOCKER_GID).
ARG DOCKER_GID=988

# Docker CLI + plugin do compose (apenas o cliente, não o daemon).
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
        ca-certificates curl gnupg \
 && install -m 0755 -d /etc/apt/keyrings \
 && curl -fsSL https://download.docker.com/linux/debian/gpg \
        | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
 && chmod a+r /etc/apt/keyrings/docker.gpg \
 && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
        https://download.docker.com/linux/debian $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
        > /etc/apt/sources.list.d/docker.list \
 && apt-get update \
 && apt-get install -y --no-install-recommends \
        docker-ce-cli docker-compose-plugin \
 && rm -rf /var/lib/apt/lists/*

# Cria o grupo `hostdocker` com o GID do host e coloca o user `jenkins` nele,
# permitindo ler/escrever no socket montado.
RUN groupadd -g ${DOCKER_GID} hostdocker \
 && usermod -aG hostdocker jenkins

USER jenkins

# Pré-instala plugins essenciais p/ pipelines (evita setup manual).
RUN jenkins-plugin-cli --plugins \
        workflow-aggregator \
        git \
        github \
        docker-workflow \
        configuration-as-code
