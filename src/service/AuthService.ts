import { userManager } from '@/config/authConfig';

export const AuthService = {
  /**
   * Login with username and password (it's necessary to handle the redirect to the post-login page)
   * @param username Username
   * @param password Password
   */
  loginWithCredentials(username: string, password: string) {
    return userManager.signinResourceOwnerCredentials({ username, password });
  },
  /**
   * Login with Google (after login, it'll redirect to the callback page)
   * @param postLoginRedirectRoute The route to redirect after login
   */
  loginWithGoogle(postLoginRedirectRoute?: string) {
    const then = postLoginRedirectRoute ? `?then=${postLoginRedirectRoute}` : '';
    return userManager.signinRedirect({
      redirect_uri: `${window.location.origin}/callback${then}`,
      extraQueryParams: { kc_idp_hint: 'google' }
    });
  },
  /**
   * Register a new user (after register, it'll redirect to the callback page)
   */
  register() {
    return userManager.signinRedirect();
  },
  /**
   * Handle the callback after login (except for the login with resource owner credentials)
   */
  handleCallback() {
    return userManager.signinCallback();
  },
  /**
   * Logout the user
   */
  logout() {
    return userManager.signoutRedirect();
  },
  /**
   * Get the user information
   */
  getUser() {
    return userManager.getUser();
  },
  accountConsoleUrl: 'https://auth.falcon-shield.tech/realms/FalconShield/account'
};
