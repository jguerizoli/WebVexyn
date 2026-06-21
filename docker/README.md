# docker/ — Infra do WebVexyn

Árvore de orquestração da hospedagem. Detalhes da arquitetura em
`../INFRAESTRUTURA.md`; estado/passos do setup em `../playbook.md`.

## Conteúdo

| Arquivo | Função |
|---------|--------|
| `Dockerfile` | Build multi-stage do site: clona o repo na branch alvo (`ARG BRANCH`), `npm ci`, `vite build`, serve o `dist/` via Nginx. `ARG NGINX_CONF` escolhe `prod.conf`/`dev.conf`. |
| `docker-compose.yml` | 3 serviços: `webvexyn-prod` (127.0.0.1:8080), `webvexyn-dev` (127.0.0.1:8081), `jenkins` (127.0.0.1:8082 + :50000). |
| `.env` | Segredos locais (`GIT_TOKEN`, `DOCKER_GID`). **Não commitar.** Modelo em `.env.example`. |
| `nginx/prod.conf`, `nginx/dev.conf` | Nginx de cada container (SPA `try_files … /index.html`, gzip, política de cache). |
| `jenkins/Dockerfile` | Jenkins LTS + Docker CLI + grupo `hostdocker` (GID = `DOCKER_GID`) p/ acessar o socket do host. |
| `jenkins/Jenkinsfile.prod`, `Jenkinsfile.dev` | Pipelines manuais (Build → Deploy → Health Check → Cleanup). |
| `host-nginx/webvexyn.conf` | Reverse proxy do Nginx do **host** (copiar p/ `/etc/nginx/sites-available/`; Certbot adiciona o SSL). |
| `scripts/` | Scripts deprecados (substituídos pelo Jenkins). |

## Decisões importantes

- **Repo público** → o clone no build não precisa de token (`GIT_TOKEN` vazio).
- **RAM ~1.9 GB** → heap do Node limitado (`NODE_OPTIONS=--max-old-space-size=1024`)
  e JVM do Jenkins em `-Xmx512m`. Risco de OOM em builds; buildar um serviço por vez.
- **Portas publicadas em `127.0.0.1`** → só o Nginx do host expõe à internet.
- **`DOCKER_GID`** → ajustar após instalar o Docker: `getent group docker | cut -d: -f3`.

## Subir (após Docker instalado e branch `develop` criada)

```bash
cd /var/www/webvexyn/docker
cp .env.example .env   # e ajustar DOCKER_GID
docker compose build --no-cache webvexyn-prod webvexyn-dev
docker compose up -d
docker compose ps
```
