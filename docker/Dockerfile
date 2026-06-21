# WebVexyn — build do site (multi-stage) e serve via Nginx
# Stage 1: clona o repo na branch alvo, instala deps e roda o build do Vite.
# Stage 2: serve o /dist estático com Nginx.

# ---------- Stage 1: builder ----------
FROM node:22-alpine AS builder

# Repo é PÚBLICO -> clone sem token. (GIT_TOKEN fica disponível p/ uso futuro.)
ARG REPO_URL=https://github.com/jguerizoli/WebVexyn.git
ARG BRANCH=main
ARG GIT_TOKEN=""

# Limita o heap do Node: a máquina tem só ~1.9 GB de RAM (risco de OOM com R3F/Three).
ENV NODE_OPTIONS=--max-old-space-size=1024

RUN apk add --no-cache git

WORKDIR /app

# Clone raso da branch alvo. Se REPO virar privado, o token é injetado na URL.
RUN if [ -n "$GIT_TOKEN" ]; then \
      git clone --depth 1 --branch "$BRANCH" \
        "https://x-access-token:${GIT_TOKEN}@github.com/jguerizoli/WebVexyn.git" . ; \
    else \
      git clone --depth 1 --branch "$BRANCH" "$REPO_URL" . ; \
    fi

# Instala deps de forma reprodutível (usa package-lock.json).
RUN npm ci

# Build: tsc -b && vite build  ->  gera /app/dist
RUN npm run build

# ---------- Stage 2: runtime (nginx) ----------
FROM nginx:alpine

# Qual config usar (prod.conf p/ produção, dev.conf p/ desenvolvimento).
ARG NGINX_CONF=prod.conf

# Config do Nginx do container (SPA + gzip). Sobrescreve a default.
COPY nginx/${NGINX_CONF} /etc/nginx/conf.d/default.conf

# Artefatos estáticos do build.
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# wget já vem na imagem alpine do nginx -> usado pelo healthcheck do compose.
CMD ["nginx", "-g", "daemon off;"]
