# Deploy de los docs

El sitio sale en `https://perfumeui.servaltek.com`, en Coolify, detrás de
[oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/): sólo entran las cuentas de
Keycloak (`auth.servaltek.com`, realm `servaltek`) que tengan el client role `perfumeui-docs:viewer`.

```
usuario → Traefik de Coolify (dominio + SSL) → contenedor [oauth2-proxy + dist/] ↔ Keycloak
```

| Archivo | Qué es |
|---|---|
| `Dockerfile` (raíz) | Etapa 1: `pnpm install` + `pnpm build`. Etapa 2: oauth2-proxy sirviendo `apps/docs/dist`. |
| `.dockerignore` (raíz) | Deja afuera `node_modules`, `dist`, `.env*`, `.git`. |
| `deploy/oauth2-proxy.cfg` | Config del proxy, sin secretos. |

## 1. Keycloak

En el realm `servaltek`:

1. **Clients → Create client**
   - Client type: OpenID Connect · Client ID: `perfumeui-docs`
   - Client authentication: **On** · Standard flow: **On** · el resto, Off
   - Valid redirect URIs: `https://perfumeui.servaltek.com/oauth2/callback`
   - Valid post logout redirect URIs: `https://perfumeui.servaltek.com/*`
   - Web origins: `https://perfumeui.servaltek.com`
2. **Credentials** del client: copiá el *Client secret* (va en Coolify).
3. **Roles** del client → Create role: `viewer`.
4. **Client scopes** del client → `perfumeui-docs-dedicated` → Add mapper → By configuration → **Audience**
   - Included Client Audience: `perfumeui-docs` · Add to access token: **On**
5. **Groups** → crear `perfumeui-docs-viewers` → Role mapping → Assign role → filtrar por clients →
   `perfumeui-docs viewer`. Meté en ese grupo las cuentas que tienen que entrar.

Además, el `AppNavbar` de los docs hace su propio login del lado del cliente con el client
`servaltek-auth-dev` (`packages/perfumeui/src/lib/auth.ts`). Para que ande en el dominio nuevo, ese
client tiene que tener:

- Valid redirect URIs: `https://perfumeui.servaltek.com/callback` y `https://perfumeui.servaltek.com/silent-renew`
- Web origins: `https://perfumeui.servaltek.com`

## 2. Coolify

1. **New Resource → Private Repository** (GitHub App o deploy key) → este repo, branch `master`.
2. Build Pack: **Dockerfile** · Dockerfile location: `/Dockerfile` · Base directory: `/`.
3. Domains: `https://perfumeui.servaltek.com` · Ports exposes: `4180`.
4. **Environment variables** (marcalas como secretas, *no* como build variables):

   | Variable | Valor |
   |---|---|
   | `OAUTH2_PROXY_CLIENT_SECRET` | el client secret del paso 1.2 |
   | `OAUTH2_PROXY_COOKIE_SECRET` | salida de `openssl rand -base64 32 \| tr -- '+/' '-_'` |

5. Health check: el contenedor ya trae uno (`/ping`), no hace falta configurar otro.
6. Deploy. Con *Auto Deploy* activado, cada push a `master` reconstruye.

El DNS de `perfumeui.servaltek.com` tiene que apuntar (registro A) a la IP del VPS antes del
primer deploy, para que Coolify pueda sacar el certificado de Let's Encrypt.

## Dar o sacar acceso

Agregás o sacás la cuenta del grupo `perfumeui-docs-viewers` en Keycloak. Quien pierde el rol
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
