# Docs de PerfumeUI detrás de oauth2-proxy + Keycloak.
# Etapa 1 arma el sitio estático; etapa 2 lo sirve sólo a cuentas con el rol.
# Ver deploy/README.md.

FROM node:24-alpine AS build
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app

# Manifiestos primero para cachear el install entre deploys.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/perfumeui/package.json packages/perfumeui/
COPY apps/docs/package.json apps/docs/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM quay.io/oauth2-proxy/oauth2-proxy:v7.15.5-alpine
COPY --from=build /app/apps/docs/dist /srv/dist
COPY deploy/oauth2-proxy.cfg /etc/oauth2-proxy.cfg

EXPOSE 4180
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1:4180/ping || exit 1

ENTRYPOINT ["/bin/oauth2-proxy"]
CMD ["--config=/etc/oauth2-proxy.cfg"]
