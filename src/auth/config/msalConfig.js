import { LogLevel } from '@azure/msal-browser';
import { Capacitor } from '@capacitor/core';

// Determine redirect URI based on platform
const getRedirectUri = () => {
  if (Capacitor.isNativePlatform()) {
    return import.meta.env.VITE_MSAL_MOBILE_REDIRECT_URI;
  }
  return import.meta.env.VITE_MSAL_REDIRECT_URI;
};

const getPostLogoutRedirectUri = () => {
  if (Capacitor.isNativePlatform()) {
    return import.meta.env.VITE_MSAL_MOBILE_REDIRECT_URI;
  }
  return import.meta.env.VITE_MSAL_POST_LOGOUT_REDIRECT_URI;
};

// MSAL configuration
export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: import.meta.env.VITE_MSAL_AUTHORITY,
    redirectUri: getRedirectUri(),
    postLogoutRedirectUri: getPostLogoutRedirectUri(),
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
      logLevel: LogLevel.Info,
    },
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ['User.Read'],
};

// Add scopes here for access token to be used at Microsoft Graph API endpoints.
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};