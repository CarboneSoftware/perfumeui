# Deploy de los docs

El sitio sale en `https://perfume.servaltek.com`, en Coolify, detrás de
[oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/): sólo entran las cuentas de
Keycloak (`auth.servaltek.com`, realm `servaltek`) que tengan el rol de realm `developer`.

```
usuario → Cloudflare (SSL) → cloudflared → Traefik de Coolify (HTTP) → contenedor [oauth2-proxy + dist/] ↔ Keycloak
```

| Archivo | Qué es |
|---|---|
| `Dockerfile` (raíz) | Etapa 1: `pnpm install` + `pnpm build`. Etapa 2: oauth2-proxy sirviendo `apps/docs/dist`. |
| `.dockerignore` (raíz) | Deja afuera `node_modules`, `dist`, `.env*`, `.git`. |
| `deploy/oauth2-proxy.cfg` | Config del proxy, sin secretos. |
| `deploy/templates/error.html` | Página de error del proxy (403 sin el rol, fallas de login) con el estilo de PerfumeUI. CSS y logos inline: se sirve antes del login. |

## 1. Keycloak

En el realm `servaltek`:

1. **Clients → Create client**
   - Client type: OpenID Connect · Client ID: `perfumeui-docs`
   - Client authentication: **On** · Standard flow: **On** · el resto, Off
   - Valid redirect URIs: `https://perfume.servaltek.com/oauth2/callback`
   - Valid post logout redirect URIs: `https://perfume.servaltek.com/*`
   - Web origins: `https://perfume.servaltek.com`
2. **Credentials** del client: copiá el *Client secret* (va en Coolify).
3. **Client scopes** del client → `perfumeui-docs-dedicated` → Add mapper → By configuration → **Audience**
   - Included Client Audience: `perfumeui-docs` · Add to access token: **On**
4. Chequeá que las cuentas que tienen que entrar tengan el rol de realm **`developer`**
   (Users → la cuenta → Role mapping, directo o heredado de un grupo).
5. **Client scopes** del client → pestaña *Setup*: el scope **`roles`** tiene que estar como *Default*
   (viene así de fábrica). Es el que mete `realm_access.roles` en el access token, que es lo que mira
   oauth2-proxy.

Además, el `AppNavbar` de los docs hace su propio login del lado del cliente con el client
`servaltek-frontend` (`packages/perfumeui/src/lib/auth.ts`). Para que ande en el dominio nuevo, ese
client tiene que tener:

- Valid redirect URIs: `https://perfume.servaltek.com/callback` y `https://perfume.servaltek.com/silent-renew`
- Web origins: `https://perfume.servaltek.com`

## 2. Coolify

1. **New Resource → Private Repository** (GitHub App o deploy key) → este repo, branch `main`.
2. Build Pack: **Dockerfile** · Dockerfile location: `/Dockerfile` · Base directory: `/`.
3. Domains: `http://perfume.servaltek.com` (con `http://`: el SSL lo pone Cloudflare; con `https://`
   Traefik redirige a HTTPS y, como el túnel le llega por HTTP, entra en loop) · Ports exposes: `4180`.
4. **Environment variables** (marcalas como secretas, *no* como build variables):

   | Variable | Valor |
   |---|---|
   | `OAUTH2_PROXY_CLIENT_SECRET` | el client secret del paso 1.2 |
   | `OAUTH2_PROXY_COOKIE_SECRET` | salida de `openssl rand -base64 32 \| tr -- '+/' '-_'` |

5. Health check: el contenedor ya trae uno (`/ping`), no hace falta configurar otro.
6. Deploy. Con *Auto Deploy* activado, cada push a `main` reconstruye.

## 3. Cloudflare Tunnel

El dominio no apunta a la IP del VPS: entra por el túnel de `cloudflared` que corre en el servidor.
En su config, la regla va antes del catch-all:

```yaml
ingress:
  - hostname: perfume.servaltek.com
    service: http://localhost:80
  - service: http_status:404
```

El CNAME se crea una vez con `cloudflared tunnel route dns <tunnel-id> perfume.servaltek.com` y
después se reinicia el servicio (`sudo systemctl restart cloudflared`). Coolify puede mostrar una
advertencia de DNS porque el dominio resuelve a IPs de Cloudflare: es esperable.

## Dar o sacar acceso

Le das o le sacás el rol `developer` a la cuenta en Keycloak. Quien pierde el rol
queda afuera en, como mucho, 15 minutos (`cookie_refresh` en `oauth2-proxy.cfg`).

## Probar el contenedor en local

Agregá `http://localhost:4180/oauth2/callback` a los redirect URIs del client `perfumeui-docs` y:

```bash
docker build -t perfumeui-docs .
```

```bash
docker run --rm -p 4180:4180 -e OAUTH2_PROXY_CLIENT_SECRET=<secret> -e OAUTH2_PROXY_COOKIE_SECRET=<cookie-secret> -e OAUTH2_PROXY_REDIRECT_URL=http://localhost:4180/oauth2/callback -e OAUTH2_PROXY_COOKIE_SECURE=false perfumeui-docs
```

Y abrí `http://localhost:4180`. Con una cuenta sin el rol tenés que ver un 403.
