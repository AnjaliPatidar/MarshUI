export const oktaConfig = {
    issuer: 'https://trial-2718395.okta.com/oauth2/default',
    clientId: "0oaj0jpf6pR8CT9T0697",
    redirectUri: window.location.origin + '/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true
};