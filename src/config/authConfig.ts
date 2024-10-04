import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

//?FLOW -> Authorization Code Grant with Proof Key for Code Exchange (PKCE)
//!importante: habilitar el PKCE en Keycloak -> clients/your-client-name/Settings/Advanced Settings/Proof Key for Code Exchange Code Challenge Method/S256
export const userManager = new UserManager({
  authority: 'http://localhost:9090/realms/FalconShield',
  client_id: 'falcon-shield-client',
  client_secret: '',
  redirect_uri: `${window.location.origin}`,
  post_logout_redirect_uri: `${window.location.origin}/login`,
  response_type: 'code',
  scope: 'openid profile email',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
});

//ACCOUNT CONSOLE -> https://localhost:9090/realms/FalconShield/account/
//ADMIN CONSOLE   -> https://localhost:9090/admin/master/console/
