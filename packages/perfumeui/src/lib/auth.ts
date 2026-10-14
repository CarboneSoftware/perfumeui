import { UserManager, WebStorageStateStore } from "oidc-client-ts";

export const userManager = new UserManager({
    authority: "https://auth.servaltek.com/realms/servaltek",
    client_id: "perfumeui-docs",
    // client_id: "servaltek-auth-dev",
    redirect_uri: `${window.location.origin}/callback`,
    post_logout_redirect_uri: window.location.origin,
    silent_redirect_uri: `${window.location.origin}/silent-renew`,
    response_type: "code",
    scope: "openid profile email",
    userStore: new WebStorageStateStore({ store: sessionStorage }),
    automaticSilentRenew: true,
});

export async function checkSession() {
    // 1. ¿Ya tengo el usuario guardado en esta pestaña y no expiró?
    const local = await userManager.getUser();
    if (local && !local.expired) return local;

    try {
        return await userManager.signinSilent();
    } catch {
        return null; 
    }
}

export const login = () => userManager.signinRedirect();
export const logout = () => userManager.signoutRedirect();
export const getUser = () => userManager.getUser();
