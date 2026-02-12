import { Capacitor } from '@capacitor/core';
import { MsalPlugin } from '@tashelix/capacitor-msal-auth';
import { initializeMsal } from '../services/msalInstance';

export const authGuard = async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    return next();
  }

  let authenticated = false;

  if (Capacitor.isNativePlatform()) {
    try {
      const result = await MsalPlugin.getAccounts();
      authenticated = result?.accounts?.length > 0;
    } catch {
      authenticated = false;
    }
  } else {
    const msalInstance = await initializeMsal();
    await msalInstance.handleRedirectPromise();

    const accounts = msalInstance.getAllAccounts();
    authenticated = accounts.length > 0;

    if (authenticated && !msalInstance.getActiveAccount()) {
      msalInstance.setActiveAccount(accounts[0]);
    }
  }

  if (!authenticated) {
    return next('/login');
  }

  if (to.name === 'login') {
    return next('/systems');
  }

  next();
};


export default authGuard;