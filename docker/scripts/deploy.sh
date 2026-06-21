#!/usr/bin/env bash
# DEPRECADO — substituído pelos pipelines do Jenkins (webvexyn-prod / webvexyn-dev).
# Mantido apenas como referência histórica. O deploy oficial é:
#   cd /var/www/webvexyn/docker
#   docker compose build --no-cache <serviço> && docker compose up -d <serviço>
echo "Script deprecado. Use o Jenkins (Build Now) ou 'docker compose build/up' manualmente." >&2
exit 1
