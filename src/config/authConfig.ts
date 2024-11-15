import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

//ACCOUNT CONSOLE -> https://localhost:9090/realms/FalconShield/account/
//ADMIN CONSOLE   -> https://localhost:9090/admin/master/console/

//?FLOW -> Authorization Code Grant with Proof Key for Code Exchange (PKCE)
//!importante: habilitar el PKCE en Keycloak -> clients/your-client-name/Settings/Advanced Settings/Proof Key for Code Exchange Code Challenge Method/S256
export const userManager = new UserManager({
  authority: 'https://auth.falcon-shield.tech/realms/FalconShield',
  client_id: 'falcon-shield-client',
  client_secret: 'Py2bAGYOqDhRcLqhWHlSKX9mJsigXku4',
  redirect_uri: `${window.location.origin}/callback`,
  post_logout_redirect_uri: `${window.location.origin}/login`,
  response_type: 'code',
  scope: 'openid profile email',
  userStore: new WebStorageStateStore({ store: window.localStorage })
});

//add a listener to the accessTokenExpired event
userManager.events.addAccessTokenExpired(() => {
  console.warn('oidc access token expired');
  //token can expire while the app is in background
  //try a silent renew in that case and otherwise logout the user
  userManager.signinSilent().catch((error) => {
    console.error('Silent renew failed:', error);
    userManager.signoutSilent();
  });
});

userManager.events.addSilentRenewError((err) => {
  console.warn('oidc user silent renew error', err);
});
